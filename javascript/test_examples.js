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

let options = require('./node/cmdline');

let cmdline = options.create().parse(process.argv);

// If there is no command line, we should return
if (!cmdline) {
    throw new Error("Error in parsing command line parameters");
}
let opts = cmdline.opts;

let assert = require('chai').assert;
let Async = splunkjs.Async;
let idCounter = 0;
let argv = ["program", "script"];

let getNextId = function () {
    return "id" + (idCounter++) + "_" + ((new Date()).valueOf());
};

splunkjs.Logger.setLevel("ALL");


describe("Hello World Tests", async function () {
    it("Apps", async function () {
        let main = require("./node/helloworld/apps").main;
        await main(opts);
    });

    it("Pivot#Async", async function () {
        let main = require("./node/helloworld/pivot_async").main;
        await main(opts);
    });

    it("Fired Alerts", async function () {
        let main = require("./node/helloworld/firedalerts").main;
        await main(opts);
    });

    it("Fired Alerts#Create", async function () {
        let main = require("./node/helloworld/firedalerts_create").main;
        await main(opts);
    });

    it("Fired Alerts#Delete", async function () {
        let main = require("./node/helloworld/firedalerts_delete").main;
        await main(opts);
    });

    it("Get Job by sid", async function () {
        let main = require("./node/helloworld/get_job").main;
        await main(opts);
    });

    it("Endpoint Instantiation", async function () {
        let main = require("./node/helloworld/endpoint_instantiation").main;
        await main(opts);
    });

    it("Saved Searches", async function () {
        let main = require("./node/helloworld/savedsearches").main;
        await main(opts);
    });

    it("Saved Searches#Delete", async function () {
        let main = require("./node/helloworld/savedsearches_delete").main;
        await main(opts);
    });

    it("Saved Searches#Create", async function () {
        let main = require("./node/helloworld/savedsearches_create").main;
        main(opts);
    });

    it("Saved Searches#Delete Again", async function () {
        let main = require("./node/helloworld/savedsearches_delete").main;
        await main(opts);
    });

    it("Search#normal", async function () {
        let main = require("./node/helloworld/search_normal").main;
        await main(opts);
    });

    it("Search#blocking", async function () {
        let main = require("./node/helloworld/search_blocking").main;
        await main(opts);
    });

    it("Search#oneshot", async function () {
        let main = require("./node/helloworld/search_oneshot").main;
        await main(opts);
    });

    it("Search#realtime", async function () {
        this.timeout(40000)
        let main = require("./node/helloworld/search_realtime").main;
        await main(opts);
    });

    it("Logging", async function () {
        let main = require("./node/helloworld/log").main;
        await main(opts);
    });
});

describe.skip("Jobs Example Tests", function (done) {
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
});

describe("Search Example Tests", async function () {
    beforeEach(function () {
        let context = this;

        this.main = require("./node/search").main;
        this.run = async function (command, args, options) {
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

            return await context.main(combinedArgs);
        };
    });

    it("Create regular search", async function () {
        let options = {
            search: "search index=_internal | head 5"
        };
        this.timeout(40000);
        await this.run(null, null, options);
    });

    it("Create regular search with verbose", async function () {
        let options = {
            search: "search index=_internal | head 5"
        };
        this.timeout(40000);
        await this.run(null, ["--verbose"], options);
    });

    it("Create oneshot search", async function () {
        let options = {
            search: "search index=_internal | head 5",
            exec_mode: "oneshot"
        };

        await this.run(null, ["--verbose"], options);
    });

    it("Create normal search with reduced count", async function () {
        let options = {
            search: "search index=_internal | head 20",
            count: 10
        };
        this.timeout(40000);
        await this.run(null, ["--verbose"], options);
    });
});
