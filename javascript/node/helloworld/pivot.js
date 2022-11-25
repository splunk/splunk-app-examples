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

/* 
 * This example will login to Splunk, and then retrieve the list of data models,
 * get the "internal_audit_logs", then get the "searches" data model object.
 * Then start a search on the "searches" data model object, track the
 * job until it's done. Then get and print out the results.
 * 
 * Then create a pivot specification and retrieve the pivot searches from
 * the Splunk server, run the search job for that pivot report, track
 * the job until it's done. Then get and print out the results.
 * At the end, the search job is cancelled.
 */

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

    let searches; // We'll use this later

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
        // Now that we're logged in, let's get the data models collection
        let dataModels = await service.dataModels().fetch();

        // ...and the specific data model we're concerned with
        let dm = dataModels.item("internal_audit_logs");
        // Get the "searches" object out of the "internal_audit_logs" data model
        searches = dm.objectByName("searches");

        console.log("Working with object", searches.displayName,
            "in model", dm.displayName);

        console.log("\t Lineage:", searches.lineage.join(" -> "));
        console.log("\t Internal name: " + searches.name);

        // Run a data model search query, getting the first 5 results
        let job = await searches.startSearch({}, "| head 5");
        let results;
        await job.track({}, async function (job) {
            [results, job] = await job.results({});
        });

        // Print out the results
        console.log("Results:");
        for (let i = 0; i < results.rows.length; i++) {
            let rowString = " result " + i + ":  ";
            let row = results.rows[i];
            for (let j = 0; j < results.fields.length; j++) {
                if (row[j] !== null && row[j] !== undefined) {
                    rowString += results.fields[j] + "=" + row[j] + ", ";
                }
            }
            console.log(rowString);
            console.log("------------------------------");
        }

        let pivotSpecification = searches.createPivotSpecification();
        // Each function call here returns a pivotSpecification so we can chain them
        let pivot; 
        [job, pivot] = await pivotSpecification
            .addRowSplit("user", "Executing user")
            .addRangeColumnSplit("exec_time", { limit: 4 })
            .addCellValue("search", "Search Query", "values")
            .run();
            
        console.log("Query for binning search queries by execution time and executing user:");
        console.log("\t", pivot.prettyQuery);
        await job.track({}, async function (job) {
            [results, job] = await job.results({});
        });

        // Print out the results
        console.log("Results:");
        for (let i = 0; i < results.rows.length; i++) {
            let rowString = " result " + i + ":  ";
            let row = results.rows[i];
            for (let j = 0; j < results.fields.length; j++) {
                if (row[j] !== null && row[j] !== undefined) {
                    rowString += results.fields[j] + "=" + row[j] + ", ";
                }
            }
            console.log(rowString);
            console.log("------------------------------");
        }
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
