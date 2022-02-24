
// Copyright 2011 Splunk, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License"): you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

// This example will login to Splunk and perform a realtime search that counts
// how many events of each sourcetype we have seen. It will then print out
// this information every 1 second for a set number of iterations.

let splunkjs = require('splunk-sdk');
let Async  = splunkjs.Async;

exports.main = function(opts, callback) {
    // This is just for testing - ignore it
    opts = opts || {};
    
    let username = opts.username    || "admin";
    let password = opts.password    || "changed!";
    let scheme   = opts.scheme      || "https";
    let host     = opts.host        || "localhost";
    let port     = opts.port        || "8089";
    let version  = opts.version     || "default";
    
    let service = new splunkjs.Service({
        username: username,
        password: password,
        scheme: scheme,
        host: host,
        port: port,
        version: version
    });

    Async.chain([
            // First, we log in
            function(done) {
                service.login(done);
            },
            // Perform the search
            function(success, done) {
                if (!success) {
                    done("Error logging in");
                }
                
                service.search(
                    "search index=_internal | stats count by sourcetype", 
                    {earliest_time: "rt", latest_time: "rt"}, 
                    done);
            },
            // The search is never going to be done, so we simply poll it every second to get
            // more results
            function(job, done) {
                let MAX_COUNT = 5;
                let count = 0;
                
                Async.whilst(
                    // Loop for N times
                    function() { return MAX_COUNT > count; },
                    // Every second, ask for preview results
                    function(iterationDone) {
                        Async.sleep(1000, function() {
                            job.preview({}, function(err, results) {
                                if (err) {
                                    iterationDone(err);
                                    return;
                                }
                                
                                // Only do something if we have results
                                if (results && results.rows) {
                                    // Up the iteration counter
                                    count++;
                                    
                                    console.log("========== Iteration " + count + " ==========");
                                    let sourcetypeIndex = results.fields.indexOf("sourcetype");
                                    let countIndex = results.fields.indexOf("count");
                                    
                                    for(let i = 0; i < results.rows.length; i++) {
                                        let row = results.rows[i];
                                        
                                        // This is a hacky "padding" solution
                                        let stat = ("  " + row[sourcetypeIndex] + "                         ").slice(0, 30);
                                        
                                        // Print out the sourcetype and the count of the sourcetype so far
                                        console.log(stat + row[countIndex]);   
                                    }
                                    
                                    console.log("=================================");
                                }
                                    
                                // And we're done with this iteration
                                iterationDone();
                            });
                        });
                    },
                    // When we're done looping, just cancel the job
                    function(err) {
                        job.cancel(done);
                    }
                );
            }
        ],
        function(err) {
            callback(err);        
        }
    );
};

if (module === require.main) {
    exports.main({}, function() {});
}