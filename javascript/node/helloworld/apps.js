
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

// This example will login to Splunk, and then retrieve the list of applications,
// printing each application's name.

let splunkjs = require('splunk-sdk');

exports.main = function (opts, done) {
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

    // First, we log in
    service.login(function (err, success) {
        // We check for both errors in the connection as well
        // as if the login itself failed.
        if (err || !success) {
            console.log("Error in logging in");
            done(err || "Login failed");
            return;
        }

        // Now that we're logged in, let's get a listing of all the apps.
        service.apps().fetch(function (err, apps) {
            if (err) {
                console.log("There was an error retrieving the list of applications:", err);
                done(err);
                return;
            }

            let appList = apps.list();
            console.log("Applications:");
            for (let i = 0; i < appList.length; i++) {
                let app = appList[i];
                console.log("  App " + i + ": " + app.name);
            }

            done();
        });
    });
};

if (module === require.main) {
    exports.main({}, function () { /* Empty function */ });
}
