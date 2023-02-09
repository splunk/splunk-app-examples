
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

    let search = async function (service, options) {
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

        try {
            // Create a search
            let job = await service.search(query, options);
            
            try {
                // Poll until the search is complete
                await utils.whilst(
                    function () { return !job.properties().isDone; },
                    async function () {
                        await job.fetch();
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
                        await utils.sleep(1000);
                    }
                );
            } catch (err) {
                if (isVerbose) {
                    console.log("\r");
                }
                // For use by tests only
                if (module != require.main) {
                    return Promise.reject(err);
                }
            }

            // Once the search is done, get the results
            let res = await job.results({ count: count, json_mode: mode });
            let results = res[0];
            job = res[1];

            // Print them out (as JSON), and cancel the job
            process.stdout.write(JSON.stringify(results));
            await job.cancel();
        } catch (err) {
            console.log("Error: ", err);
            // For use by tests only
            if (module != require.main) {
                return Promise.reject(err);
            }
        }
    };

    let oneshotSearch = async function (service, options) {
        let query = options.search;
        delete options.search;
        
        try {
            // Oneshot searches don't have a job associated with them, so we
            // simply execute it and print out the results.
            let results = await service.oneshotSearch(query, options);
            console.log(JSON.stringify(results));
        } catch (err) {
            console.log("Error:", err);
            // For use by tests only
            if (module != require.main) {
                return Promise.reject(err);
            }
        }
    };

    exports.main = async function (argv) {
        splunkjs.Logger.setLevel("NONE");

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
            delete cmdline.username;
            delete cmdline.password;
            delete cmdline.scheme;
            delete cmdline.host;
            delete cmdline.port;
            delete cmdline.namespace;
            delete cmdline.version;

            if (cmdline.opts.exec_mode === "oneshot") {
                await oneshotSearch(service, cmdline.opts);
            }
            else {
                await search(service, cmdline.opts);
            }
        } catch (err) {
            console.log("Error:", err);
            // For use by tests only
            if (module != require.main) {
                return Promise.reject(err);
            }
        }
    };

    if (module === require.main) {
        exports.main(process.argv);
    }
})();