
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

// This example will login to Splunk, perform a regular search, wait until
// it is done, and then print out the raw results and some key-value pairs

let splunkjs = require('splunk-sdk');

exports.main = async function (opts) {
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

    try {
        try {
            // First, we log in
            await service.login();
        } catch (err) {
            console.log("Error in logging in");
            // For use by tests only
            if (module != require.main) {
                return Promise.reject(err);
            }
            return;
        }

        // Perform the search
        var job =await service.search("search index=_internal | head 3", {});
        var res;

        // Wait until the job is done
        await job.track({}, async function (job) {
            // Ask the server for the results
            res = await job.results({});
        });
        let results = res[0];
        job = res[1];
        
        // Print out the statics
        console.log("Job Statistics: ");
        console.log("  Event Count: " + job.properties().eventCount);
        console.log("  Disk Usage: " + job.properties().diskUsage + " bytes");
        console.log("  Priority: " + job.properties().priority);

        // Find the index of the fields we want
        let rawIndex = results.fields.indexOf("_raw");
        let sourcetypeIndex = results.fields.indexOf("sourcetype");
        let userIndex = results.fields.indexOf("user");

        // Print out each result and the key-value pairs we want
        console.log("Results: ");
        for (let i = 0; i < results.rows.length; i++) {
            console.log("  Result " + i + ": ");
            console.log("    sourcetype: " + results.rows[i][sourcetypeIndex]);
            console.log("    user: " + results.rows[i][userIndex]);
            console.log("    _raw: " + results.rows[i][rawIndex]);
        }

        // Once we're done, cancel the job.
        await job.cancel();
    } catch (err) {
        console.log("Error:", err);
        // For use by tests only
        if (module != require.main) {
            return Promise.reject(err);
        }
    }
};

if (module === require.main) {
    exports.main({});
}
