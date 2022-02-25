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

let splunkjs = require('splunk-sdk');

exports.setup = function (svc, opts) {
    let assert = require('chai').assert;
    let Async = splunkjs.Async;
    let idCounter = 0;
    let argv = ["program", "script"];

    let getNextId = function () {
        return "id" + (idCounter++) + "_" + ((new Date()).valueOf());
    };

    splunkjs.Logger.setLevel("ALL");

    return (
        describe("Hello World Tests", function (done) {
            it("Apps", function (done) {
                let main = require("./node/helloworld/apps").main;
                main(opts, done);
            });

            it("Apps#Async", function (done) {
                let main = require("./node/helloworld/apps_async").main;
                main(opts, done);
            });

            it("Pivot#Async", function (done) {
                let main = require("./node/helloworld/pivot_async").main;
                main(opts, done);
            });

            it("Fired Alerts", function (done) {
                let main = require("./node/helloworld/firedalerts").main;
                main(opts, done);
            });

            it("Fired Alerts#Async", function (done) {
                let main = require("./node/helloworld/firedalerts_async").main;
                main(opts, done);
            });

            it("Fired Alerts#Create", function (done) {
                let main = require("./node/helloworld/firedalerts_create").main;
                main(opts, done);
            });

            it("Fired Alerts#Delete", function (done) {
                let main = require("./node/helloworld/firedalerts_delete").main;
                main(opts, done);
            });

            it("Get Job by sid", function (done) {
                let main = require("./node/helloworld/get_job").main;
                main(opts, done);
            });

            it("Endpoint Instantiation", function (done) {
                let main = require("./node/helloworld/endpoint_instantiation").main;
                main(opts, done);
            });

            it("Saved Searches", function (done) {
                let main = require("./node/helloworld/savedsearches").main;
                main(opts, done);
            });

            it("Saved Searches#Async", function (done) {
                let main = require("./node/helloworld/savedsearches_async").main;
                main(opts, done);
            });

            it("Saved Searches#Delete", function (done) {
                let main = require("./node/helloworld/savedsearches_delete").main;
                main(opts, done);
            });

            it("Saved Searches#Create", function (done) {
                let main = require("./node/helloworld/savedsearches_create").main;
                main(opts, done);
            });

            it("Saved Searches#Delete Again", function (done) {
                let main = require("./node/helloworld/savedsearches_delete").main;
                main(opts, done);
            });

            it("Search#normal", function (done) {
                let main = require("./node/helloworld/search_normal").main;
                main(opts, done);
            });

            it("Search#blocking", function (done) {
                let main = require("./node/helloworld/search_blocking").main;
                main(opts, done);
            });

            it("Search#oneshot", function (done) {
                let main = require("./node/helloworld/search_oneshot").main;
                main(opts, done);
            });

            it("Search#realtime", function (done) {

                this.timeout(40000)
                let main = require("./node/helloworld/search_realtime").main;
                main(opts, done);
            });

            it("Logging", function (done) {
                let main = require("./node/helloworld/log").main;
                main(opts, done);
            })
        }),

        describe("Jobs Example Tests", function (done) {
            beforeEach(function (done) {
                let context = this;

                this.main = require("./node/jobs").main;
                this.run = function (command, args, options, callback) {
                    let combinedArgs = argv.slice();
                    if (command) {
                        combinedArgs.push(command);
                    }

                    if (args) {
                        for (let arg of args) {
                            combinedArgs.push(arg);
                        }
                    }

                    if (options) {
                        for (let key in options) {
                            if (options.hasOwnProperty(key)) {
                                combinedArgs.push("--" + key);
                                combinedArgs.push(options[key]);
                            }
                        }
                    }

                    return context.main(combinedArgs, callback);
                };

                done();
            });

            it("help", function (done) {
                this.run(null, null, null, function (err) {
                    assert.ok(!!err);
                    done();
                });
            });

            it("List jobs", function (done) {
                this.run("list", null, null, function (err) {
                    assert.ok(!err);
                    done();
                });
            });

            it("Create job", function (done) {
                let create = {
                    search: "search index=_internal | head 1",
                    id: getNextId()
                };

                let context = this;
                context.run("create", [], create, function (err) {
                    assert.ok(!err);
                    context.run("cancel", [create.id], null, function (err) {
                        assert.ok(!err);
                        done();
                    });
                });
            });

            it("Cancel job", function (done) {
                let create = {
                    search: "search index=_internal | head 1",
                    id: getNextId()
                };

                let context = this;
                context.run("create", [], create, function (err) {
                    assert.ok(!err);
                    context.run("cancel", [create.id], null, function (err) {
                        assert.ok(!err);
                        done();
                    });
                });
            });

            it("List job properties", function (done) {
                let create = {
                    search: "search index=_internal | head 1",
                    id: getNextId()
                };

                let context = this;
                context.run("create", [], create, function (err) {
                    assert.ok(!err);
                    context.run("list", [create.id], null, function (err) {
                        assert.ok(!err);
                        context.run("cancel", [create.id], null, function (err) {
                            assert.ok(!err);
                            done();
                        });
                    });
                });
            });

            it("List job events", function (done) {
                let create = {
                    search: "search index=_internal | head 1",
                    id: getNextId()
                };

                let context = this;
                context.run("create", [], create, function (err) {
                    assert.ok(!err);
                    context.run("events", [create.id], null, function (err) {
                        assert.ok(!err);
                        context.run("cancel", [create.id], null, function (err) {
                            assert.ok(!err);
                            done();
                        });
                    });
                });
            });

            it("List job preview", function (done) {
                let create = {
                    search: "search index=_internal | head 1",
                    id: getNextId()
                };

                let context = this;
                context.run("create", [], create, function (err) {
                    assert.ok(!err);
                    context.run("preview", [create.id], null, function (err) {
                        assert.ok(!err);
                        context.run("cancel", [create.id], null, function (err) {
                            assert.ok(!err);
                            done();
                        });
                    });
                });
            });

            it("List job results", function (done) {
                let create = {
                    search: "search index=_internal | head 1",
                    id: getNextId()
                };

                let context = this;
                context.run("create", [], create, function (err) {
                    assert.ok(!err);
                    context.run("results", [create.id], null, function (err) {
                        assert.ok(!err);
                        context.run("cancel", [create.id], null, function (err) {
                            assert.ok(!err);
                            done();
                        });
                    });
                });
            });

            it("List job results, by column", function (done) {
                let create = {
                    search: "search index=_internal | head 1",
                    id: getNextId()
                };

                let context = this;
                context.run("create", [], create, function (err) {
                    assert.ok(!err);
                    context.run("results", [create.id], { output_mode: "json_cols" }, function (err) {
                        assert.ok(!err);
                        context.run("cancel", [create.id], null, function (err) {
                            assert.ok(!err);
                            done();
                        });
                    });
                });
            });

            it("Create+list multiple jobs", function (done) {
                let creates = [];
                for (let i = 0; i < 3; i++) {
                    creates[i] = {
                        search: "search index=_internal | head 1",
                        id: getNextId()
                    };
                }
                let sids = creates.map(function (create) { return create.id; });

                let context = this;
                Async.parallelMap(
                    creates,
                    function (create, idx, done) {
                        context.run("create", [], create, function (err, job) {
                            assert.ok(!err);
                            assert.ok(job);
                            assert.strictEqual(job.sid, create.id);
                            done(null, job);
                        });
                    },
                    function (err, created) {
                        for (let i = 0; i < created.length; i++) {
                            assert.strictEqual(creates[i].id, created[i].sid);
                        }

                        context.run("list", sids, null, function (err) {
                            assert.ok(!err);
                            context.run("cancel", sids, null, function (err) {
                                assert.ok(!err);
                                done();
                            });
                        });

                    }
                );
            });
        }),

        describe("Search Example Tests", function (done) {
            beforeEach(function (done) {
                let context = this;

                this.main = require("./node/search").main;
                this.run = function (command, args, options, callback) {
                    let combinedArgs = argv.slice();
                    if (command) {
                        combinedArgs.push(command);
                    }

                    if (args) {
                        for (const arg of args) {
                            combinedArgs.push(arg);
                        }
                    }

                    if (options) {
                        for (let key in options) {
                            if (options.hasOwnProperty(key)) {
                                combinedArgs.push("--" + key);
                                combinedArgs.push(options[key]);
                            }
                        }
                    }

                    return context.main(combinedArgs, callback);
                };

                done();
            });

            it("Create regular search", function (done) {
                let options = {
                    search: "search index=_internal | head 5"
                };
                this.timeout(40000);
                this.run(null, null, options, function (err) {
                    assert.ok(!err);
                    done();
                });
            });

            it("Create regular search with verbose", function (done) {
                let options = {
                    search: "search index=_internal | head 5"
                };
                this.timeout(40000);
                this.run(null, ["--verbose"], options, function (err) {
                    assert.ok(!err);
                    done();
                });
            });

            it("Create oneshot search", function (done) {
                let options = {
                    search: "search index=_internal | head 5",
                    exec_mode: "oneshot"
                };

                this.run(null, ["--verbose"], options, function (err) {
                    assert.ok(!err);
                    done();
                });
            });

            it("Create normal search with reduced count", function (done) {
                let options = {
                    search: "search index=_internal | head 20",
                    count: 10
                };
                this.timeout(40000);
                this.run(null, ["--verbose"], options, function (err) {
                    assert.ok(!err);
                    done();
                });
            });
        })

        // This test is commented out because it causes a failure/hang on
        // Node >0.6. We need to revisit this test, so disabling it for now.
        /*"Results Example Tests": {
            
            "Parse row results": function(done) {
                let main = require("../node/results").main;
                
                svc.search(
                    "search index=_internal | head 1 | stats count by sourcetype", 
                    {exec_mode: "blocking"}, 
                    function(err, job) {
                        assert.ok(!err);
                        job.results({output_mode: "json_rows"}, function(err, results) {
                            assert.ok(!err);
                            process.stdin.emit("data", JSON.stringify(results));
                            process.stdin.emit("end");
                        });
                    }
                );
                
                main([], function(err) {
                    assert.ok(!err);
                    done();
                });
            },
            
            "Parse column results": function(done) {
                let main = require("../node/results").main;
                
                svc.search(
                    "search index=_internal | head 10 | stats count by sourcetype", 
                    {exec_mode: "blocking"}, 
                    function(err, job) {
                        assert.ok(!err);
                        job.results({output_mode: "json_cols"}, function(err, results) {
                            assert.ok(!err);
                            process.stdin.emit("data", JSON.stringify(results));
                            process.stdin.emit("end");
                        });    
                    }
                );
                
                main([], function(err) {
                    assert.ok(!err);
                    done();
                });
            },
            
            "Close stdin": function(done) {
                process.stdin.destroy();
                done();
            }
        }*/
    )
};

// Run the individual test suite
// if (module.id === __filename && module.parent.id.includes('mocha')) {
if (module.id === __filename) {

    let options = require('./node/cmdline');

    let cmdline = options.create().parse(process.argv);

    // If there is no command line, we should return
    if (!cmdline) {
        throw new Error("Error in parsing command line parameters");
    }

    let svc = new splunkjs.Service({
        scheme: cmdline.opts.scheme,
        host: cmdline.opts.host,
        port: cmdline.opts.port,
        username: cmdline.opts.username,
        password: cmdline.opts.password,
        version: cmdline.opts.version
    });

    // Exports tests on a successful login
    module.exports = new Promise((resolve, reject) => {
        svc.login(function (err, success) {
            if (err || !success) {
                console.log(err);
                throw new Error("Login failed - not running tests", err || "");
            }
            return resolve(exports.setup(svc, cmdline.opts));
        });
    });
}
