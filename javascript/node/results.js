
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

(function () {
    let splunkjs = require('splunk-sdk');
    let Class = splunkjs.Class;
    let utils = splunkjs.Utils;
    let Async = splunkjs.Async;
    let options = require('./cmdline');

    // Print the result rows
    let printRows = function (results) {
        for (let i = 0; i < results.rows.length; i++) {
            console.log("Result " + (i + 1) + ": ");
            let row = results.rows[i];
            for (let j = 0; j < results.fields.length; j++) {
                let field = results.fields[j];
                let value = row[j];

                console.log("  " + field + " = " + value);
            }
        }
    };

    // Instead of trying to print the column-major format, we just
    // transpose it
    let transpose = function (results) {
        let rows = [];
        let cols = results.columns;

        let mapFirst = function (col) { return col.shift(); };

        while (cols.length > 0 && cols[0].length > 0) {
            rows.push(cols.map(mapFirst));
        }

        results.rows = rows;
        return results;
    };

    // Print the results
    let printResults = function (results) {
        if (results) {
            let isRows = !!results.rows;
            let numResults = (results.rows ? results.rows.length : (results.columns[0] || []).length);

            console.log("====== " + numResults + " RESULTS (preview: " + !!results.preview + ") ======");

            // If it is in column-major form, transpose it.
            if (!isRows) {
                results = transpose(results);
            }

            printRows(results);
        }
    };

    exports.main = function (argv, callback) {
        splunkjs.Logger.setLevel("NONE");

        // Read data from stdin
        let incomingResults = "";
        let onData = function (data) {
            incomingResults += data.toString("utf-8");
        };

        // When there is no more data, parse it and pretty
        // print it
        let onEnd = function () {
            let results = JSON.parse(incomingResults || "{}");
            printResults(results);
            callback();
        };

        let onError = function () {
            callback("ERROR");
        };

        // Unregister all the listeners when we're done
        let originalCallback = callback || function () { /* Empty function */ };
        callback = function () {
            process.stdin.removeListener("data", onData);
            process.stdin.removeListener("end", onEnd);
            process.stdin.removeListener("error", onError);
            process.stdin.pause();

            originalCallback.apply(null, arguments);
        };

        process.stdin.on("data", onData);
        process.stdin.on("end", onEnd);
        process.stdin.on("error", onError);

        process.stdin.resume();
    };

    if (module === require.main) {
        exports.main(process.argv);
    }
})();
