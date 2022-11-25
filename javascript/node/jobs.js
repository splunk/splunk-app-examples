
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
    let FLAGS_EVENTS = [
        "offset", "count", "earliest_time", "latest_time", "search",
        "time_format", "output_time_format", "field_list", "f", "max_lines",
        "truncation_mode", "output_mode", "segmentation"
    ];
    let FLAGS_RESULTS = [
        "offset", "count", "search", "field_list", "f", "output_mode"
    ];

    let printRows = function (data) {
        let fields = data.fields;
        let rows = data.rows;
        for (let i = 0; i < rows.length; i++) {
            let values = rows[i];
            console.log("Row " + i + ": ");
            for (let j = 0; j < values.length; j++) {
                let field = fields[j];
                let value = values[j];
                console.log("  " + field + ": " + value);
            }
        }
    };

    let printCols = function (data) {
        let fields = data.fields;
        let columns = data.columns;
        for (let i = 0; i < columns.length; i++) {
            let values = columns[i];
            let field = fields[i];
            console.log("Column " + field + " (" + i + "): ");
            for (const value of values) {
                console.log("  " + value);
            }
        }
    };

    let _check_sids = function (command, sids) {
        if (!sids || sids.length === 0) {
            throw new Error("'" + command + "' requires at least one SID");
        }
    };

    let Program = Class.extend({
        init: function (service) {
            this.service = service;

            this.run = utils.bind(this, this.run);
            this.cancel = utils.bind(this, this.cancel);
            this.create = utils.bind(this, this.create);
            this.events = utils.bind(this, this.events);
            this.list = utils.bind(this, this.list);
            this.preview = utils.bind(this, this.preview);
            this.results = utils.bind(this, this.results);
        },

        _foreach: async function (sids, fn) {
            sids = sids || [];
            // We get a list of the current jobs, and for each of them,
            // we check whether it is the job we're looking for.
            // If it is, we wrap it up in a splunkjs.Job object, and invoke
            // our function on it.
            let jobsList = [];
            let jobs = await this.service.jobs().fetch();
            let jobList = jobs.list() || [];
            for (const job of jobList) {
                if (utils.contains(sids, job.sid)) {
                    jobsList.push(job);
                }
            }

            return await utils.parallelMap(jobsList, fn);
        },

        run: async function (command, args, options) {
            let commands = {
                'cancel': this.cancel,
                'create': this.create,
                'events': this.events,
                'list': this.list,
                'preview': this.preview,
                'results': this.results
            };

            // If we don't have any command, notify the user.
            if (!command) {
                console.error("You must supply a command to run. Options are:");
                for (let key in commands) {
                    if (commands.hasOwnProperty(key)) {
                        console.error("  " + key);
                    }
                }

                console.log("No command was specified.");
                return;
            }

            // Get the handler
            let handler = commands[command];

            // If there is no handler (because the user specified an invalid command,
            // then we notify the user as an error.
            if (!handler) {
                console.log("Unrecognized command: " + command);
                return;
            }

            // Invoke the command
            return await handler(args, options);
        },

        // Cancel the specified search jobs
        cancel: async function (sids, options) {
            _check_sids('cancel', sids);

            // For each of the supplied sids, cancel the job.
            let [err, vals] = await this._foreach(sids, async function (job, idx) {
                try {
                    await job.cancel();
                    console.log("  Job " + job.sid + " cancelled");
                    return [null, null];
                } catch (err) {
                    console.log("Error:", err);
                    // For use by tests only
                    if (module != require.main) {
                        return Promise.reject(err);
                    }
                }       
            });
            return vals;
        },

        // Retrieve events for the specified search jobs
        events: async function (sids, options) {
            // For each of the passed in sids, get the relevant events
            let [err, vals] = await this._foreach(sids, async function (job, idx) {
                 try {
                    let data;
                    [data, job] = await job.events(options);
                    console.log("===== EVENTS @ " + job.sid + " =====");
                    
                    let output_mode = options.output_mode || "rows";
                    if (output_mode === "json_rows") {
                        printRows(data);
                    }
                    else if (output_mode === "json_cols") {
                        console.log(data);
                        printCols(data);
                    }
                    else {
                        console.log(data);
                    }
                    return [null,data];
                } catch (err) {
                   console.log("Error:", err);
                    // For use by tests only
                    if (module != require.main) {
                        return Promise.reject(err);
                    }
                }
            });
            return vals;
        },

        // Create a search job
        create: async function (args, options) {
            // Get the query and parameters, and remove the extraneous
            // search parameter
            let query = options.search;
            let params = options;
            delete params.search;

            try {
                // Create the job
                let job = await this.service.jobs().create(query, params);
                console.log("Created job " + job.sid);
                return job;
            } catch (err) {
                console.log("Error:", err);
                // For use by tests only
                if (module != require.main) {
                    return Promise.reject(err);
                }
            }
        },

        // List all current search jobs if no jobs specified, otherwise
        // list the properties of the specified jobs.
        list: async function (sids, options) {
            sids = sids || [];

            try {
                if (sids.length === 0) {
                    // If no job SIDs are provided, we list all jobs.
                    let jobs = this.service.jobs();
                    jobs = await jobs.fetch();
                    
                    let list = jobs.list() || [];
                    for (let i = 0; i < list.length; i++) {
                        console.log("  Job " + (i + 1) + " sid: " + list[i].sid);
                    }
                }
                else {  
                    // If certain job SIDs are provided,
                    // then we simply read the properties of those jobs
                    let [err, vals] = await this._foreach(sids, async function (job, idx) {
                        job = await job.fetch();
                        console.log("Job " + job.sid + ": ");
                        let properties = job.properties();
                        for (let key in properties) {
                            // Skip some keys that make the output hard to read
                            if (utils.contains(["performance"], key)) {
                                continue;
                            }
                            console.log("  " + key + ": ", properties[key]);
                        }
                        return [null, properties];
                    });
                    return vals;
                }
            } catch (err) {
                console.log("Error:", err);
                // For use by tests only
                if (module != require.main) {
                    return Promise.reject(err);
                }
            }
        },

        // Retrieve events for the specified search jobs
        preview: async function (sids, options) {
            try {
                // For each of the passed in sids, get the relevant results
                let [err, vals] = await this._foreach(sids, async function (job, idx) {
                    let data;
                    [data, job] = await job.preview(options);
                    console.log("===== PREVIEW @ " + job.sid + " =====");
                    
                    let output_mode = options.output_mode || "rows";
                    if (output_mode === "json_rows") {
                        printRows(data);
                    }
                    else if (output_mode === "json_cols") {
                        console.log(data);
                        printCols(data);
                    }
                    else {
                        console.log(data);
                    }
                    
                    return [null, data];
                });
                return vals;
            } catch (err) {
                console.log("Error:", err);
                // For use by tests only
                if (module != require.main) {
                    return Promise.reject(err);
                }
            }
        },

        // Retrieve events for the specified search jobs
        results: async function (sids, options) {
            // For each of the passed in sids, get the relevant results
            let [err, vals] = await this._foreach(sids, async function (job, idx) {
                return await job.track({}, {
                    'done': async function (job) {
                        try {
                            let data;
                            [data, job] = await job.results(options);
                            console.log("===== RESULTS @ " + job.sid + " =====");
                            let output_mode = options.output_mode || "rows";
                            if (output_mode === "json_rows") {
                                printRows(data);
                            }
                            else if (output_mode === "json_cols") {
                                console.log(data);
                                printCols(data);
                            }
                            else {
                                console.log(data);
                            }
    
                            return [null, data];
                        } catch (err) {
                            throw err;
                        }
                    },
                    'failed': function (job) {
                        throw 'failed';
                    },
                    'error': function (err) {
                        throw err;
                    }
                });
            });
            return vals;
        }
    });

    // for use by test cases only
    exports.helper = async function (name, args, opts) {
        args = args || [];
        opts = opts || {};

        // Create our service object
        let svc = new splunkjs.Service({
            scheme: 'https',
            host: 'localhost',
            port: '8089',
            username: 'admin',
            password: 'changed!',
            version: '8.2'
        });

        try {
            try {
                // First, we log in
                await svc.login();
            } catch (err) {
                console.log("Error in logging in");
                // For use by tests only
                if (module != require.main) {
                    throw new Error(err);
                }
                return;
            }
            let program = new Program(svc);
            
            let res = await program.run(name, args, opts);
            return res;
        } catch (err) {
            console.log("Error: " + err);
            // For use by tests only
            if (module != require.main) {
                return Promise.reject(err);
            }
        }
    };

    exports.main = async function (argv) {
        let cmdline = options.create();

        let run = async function (name) {
            let options = arguments[arguments.length - 1];

            // Create our service context using the information from the command line
            let svc = new splunkjs.Service({
                scheme: cmdline.opts.scheme,
                host: cmdline.opts.host,
                port: cmdline.opts.port,
                username: cmdline.opts.username,
                password: cmdline.opts.password,
                version: cmdline.opts.version
            });

            try {
                try {
                    // First, we log in
                    await svc.login();
                } catch (err) {
                    // For use by tests only
                    if (module != require.main) {
                        return Promise.reject(err);
                    }
                    return;
                }
                let program = new Program(svc);

                await program.run(name, cmdline.args, options.opts);
            } catch (err) {
                console.log("Error: " + err);
                // For use by tests only
                if (module != require.main) {
                    return Promise.reject(err);
                }
            }
        };

        cmdline.name = "jobs";
        cmdline.description("List, create and manage search jobs");

        cmdline.add("create", "Create a new search job", "", FLAGS_CREATE, ["search"], run);
        cmdline.add("results", "Fetch results for the specified search jobs", "<sids...>", FLAGS_RESULTS, [], run);
        cmdline.add("preview", "Fetch preview results for the specified search jobs", "<sids...>", FLAGS_RESULTS, [], run);
        cmdline.add("events", "Fetch events for the specified search jobs", "<sids...>", FLAGS_EVENTS, [], run);
        cmdline.add("cancel", "Cancel the specify search jobs", "<sids...>", [], [], run);
        cmdline.add("list", "List all search jobs or properties for those specified", "[sids...]", [], [], run);

        cmdline.parse(argv);
        // Try and parse the command line
        if (!cmdline.executedCommand) {
            console.log(cmdline.helpInformation());
            console.log("You must specify a command to run.");
            return;
        }
    };

    if (module === require.main) {
        exports.main(process.argv);
    }
})();