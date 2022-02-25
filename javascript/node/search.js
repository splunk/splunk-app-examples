
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

    let FLAGS_CREATE = [
        "search", "earliest_time", "latest_time", "now", "time_format",
        "exec_mode", "search_mode", "rt_blocking", "rt_queue_size",
        "rt_maxblocksecs", "rt_indexfilter", "id", "status_buckets",
        "max_count", "max_time", "timeout", "auto_finalize_ec", "enable_lookups",
        "reload_macros", "reduce_freq", "spawn_process", "required_field_list",
        "rf", "auto_cancel", "auto_pause"
    ];

    let createService = function (options) {
        return new splunkjs.Service({
            scheme: options.scheme,
            host: options.host,
            port: options.port,
            username: options.username,
            password: options.password,
            version: options.version
        });
    };

    let search = function (service, options, callback) {
        // Extract the options we care about and delete them
        // the object
        let query = options.search;
        let isVerbose = options.verbose;
        let count = options.count || 0;
        let mode = options.mode || "row";
        delete options.search;
        delete options.verbose;
        delete options.count;
        delete options.mode;

        Async.chain([
            // Create a search
            function (done) {
                service.search(query, options, done);
            },
            // Poll until the search is complete
            function (job, done) {
                Async.whilst(
                    function () { return !job.properties().isDone; },
                    function (iterationDone) {
                        job.fetch(function (err, job) {
                            if (err) {
                                callback(err);
                            }
                            else {
                                // If the user asked for verbose output,
                                // then write out the status of the search
                                let properties = job.properties();
                                if (isVerbose) {
                                    let progress = (properties.doneProgress * 100.0) + "%";
                                    let scanned = properties.scanCount;
                                    let matched = properties.eventCount;
                                    let results = properties.resultCount;
                                    let stats = "-- " +
                                        progress + " done | " +
                                        scanned + " scanned | " +
                                        matched + " matched | " +
                                        results + " results";
                                    console.log("\r" + stats + "                                          ");
                                }

                                Async.sleep(1000, iterationDone);
                            }
                        });
                    },
                    function (err) {
                        if (isVerbose) {
                            console.log("\r");
                        }
                        done(err, job);
                    }
                );
            },
            // Once the search is done, get the results
            function (job, done) {
                job.results({ count: count, json_mode: mode }, done);
            },
            // Print them out (as JSON), and cancel the job
            function (results, job, done) {
                process.stdout.write(JSON.stringify(results));
                job.cancel(done);
            }
        ],
            function (err) {
                callback(err);
            }
        );
    };

    let oneshotSearch = function (service, options, callback) {
        let query = options.search;
        delete options.search;

        // Oneshot searches don't have a job associated with them, so we
        // simply execute it and print out the results.
        service.oneshotSearch(query, options, function (err, results) {
            if (err) {
                callback(err);
            }
            else {
                console.log(JSON.stringify(results));
                callback();
            }
        });
    };

    exports.main = function (argv, callback) {
        splunkjs.Logger.setLevel("NONE");

        callback = callback || function (err) {
            if (err) {
                console.log(err);
            }
        };
        let cmdline = options.create();

        cmdline.name = "search";
        cmdline.description("Create a search and print the results to stdout");
        cmdline.option("--verbose", "Output job progress as we wait for completion");
        cmdline.option("--count <count>", "How many results to fetch");
        cmdline.option("--mode <mode>", "Row or column mode [row|column]");

        // For each of the flags, add an option to the parser
        let flags = FLAGS_CREATE;
        let required_flags = ["search"];

        for (const flag of flags) {
            let required = required_flags.indexOf(flag) >= 0;
            let option = "<" + flag + ">";
            cmdline.option("--" + flag + " " + option, "", undefined, required);
        }

        cmdline.on('--help', function () {
            console.log("  Examples:");
            console.log("  ");
            console.log("  Create a regular search:");
            console.log("  > node search.js --search 'search index=_internal | head 10'");
            console.log("  ");
            console.log("  Create a oneshot search:");
            console.log("  > node search.js --search 'search index=_internal | head 10' --exec_mode oneshot");
            console.log("  ");
            console.log("  Create a regular search and only return 10 results:");
            console.log("  > node search.js --search 'search index=_internal | head 20' --count 10");
            console.log("  ");
            console.log("  Create a regular search and output the progress while the search is running");
            console.log("  > node search.js --search 'search index=_internal | head 20' --verbose");
            console.log("  ");
        });

        cmdline.parse(argv);

        let service = createService(cmdline.opts);
        service.login(function (err, success) {
            if (err || !success) {
                callback("Error logging in");
                return;
            }

            delete cmdline.username;
            delete cmdline.password;
            delete cmdline.scheme;
            delete cmdline.host;
            delete cmdline.port;
            delete cmdline.namespace;
            delete cmdline.version;

            if (cmdline.opts.exec_mode === "oneshot") {
                oneshotSearch(service, cmdline.opts, callback);
            }
            else {
                search(service, cmdline.opts, callback);
            }
        });
    };

    if (module === require.main) {
        exports.main(process.argv);
    }
})();