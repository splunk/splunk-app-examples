
// Copyright 2015 Splunk, Inc.
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

// This example will show how to get a `Job` by it's sid without
// fetching a collection of `Job`s.

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

    let sid;

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
        let job = await service.search("search index=_internal | head 1", {});
        // Store the sid for later use
        sid = job.sid;
        console.log("Created a search job with sid: " + job.sid);
        if (!sid) {
            console.log("Couldn't create search.");
            return;
        }
        // Since we have the job sid, we can get that job directly
        let fetchedJob = await service.getJob(sid);
        console.log("Got the job with sid: " + fetchedJob.sid);
    } catch (err) {
        if (err || !sid) {
            if (err.hasOwnProperty("data") && err.data.hasOwnProperty("messages")) {
                console.log(err.data.messages[0].text);
            }
            else {
                console.log(err);
            }
            if (!sid) {
                console.log("Couldn't create search.");
            }
        }
        // For use by tests only
        if (module != require.main) {
            return Promise.reject(err);
        }
    }
};

if (module === require.main) {
    exports.main({});
}
