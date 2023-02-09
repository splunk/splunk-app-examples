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

// This example will login to Splunk, and then try to delete the alert
// that was created in savedsearches_create.js

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
        let name = "My Awesome Alert";

        // Now that we're logged in, let's delete the alert.
        let firedAlertGroups = await service.savedSearches().fetch();
        let alertToDelete = firedAlertGroups.item(name);
        if (!alertToDelete) {
            console.log("Can't delete '" + name + "' because it doesn't exist!");
        }
        else {
            await alertToDelete.remove();
            console.log("Deleted alert: " + name + "");
        }
    } catch (err) {
        console.log("There was an error in fetching the alerts: ", err);
        // For use by tests only
        if (module != require.main) {
            return Promise.reject(err);
        }
    }
};

if (module === require.main) {
    exports.main({});
}
