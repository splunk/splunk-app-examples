// Copyright 2014 Splunk, Inc.
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

// This example will login to Splunk, and then create an alert.

let splunkjs = require('splunk-sdk');

exports.main = async function (opts) {
    // This is just for testing - ignore it.
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

    let alertOptions = {
        name: "My Awesome Alert",
        search: "index=_internal error sourcetype=splunkd* | head 10",
        "alert_type": "always",
        "alert.severity": "2",
        "alert.suppress": "0",
        "alert.track": "1",
        "dispatch.earliest_time": "-1h",
        "dispatch.latest_time": "now",
        "is_scheduled": "1",
        "cron_schedule": "* * * * *"
    };

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

        // Now that we're logged in, let's create a saved search.
        let alert = await service.savedSearches().create(alertOptions);
        console.log("Created saved search as alert: " + alert.name);
    } catch (err) {
        if (err && err.status === 409) {
            console.error("ERROR: A saved search with the name '" + alertOptions.name + "' already exists");
        }
        else {
            console.error("There was an error creating the saved search:", err);
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
