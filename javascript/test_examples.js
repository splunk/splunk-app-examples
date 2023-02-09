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
let utils = splunkjs.Utils;
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

    it("Pivot", async function () {
        let main = require("./node/helloworld/pivot").main;
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
        await main(opts);
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

describe("Jobs Example Tests", function () {
    beforeEach(function () {
        let context = this;

        this.main = require("./node/jobs").main;
        this.helper = require("./node/jobs").helper;
    });

    it("help", async function () {
        await this.main(null, null, null);
    });

    it("List jobs", async function () {
        await this.helper("list", null, null);
    });

    it("Create job", async function () {
        let create = {
            search: "search index=_internal | head 1",
            id: getNextId()
        };

        let context = this;
        await context.helper("create", [], create);
        await context.helper("cancel", [create.id], null);
    });

    it("Cancel job", async function () {
        let create = {
            search: "search index=_internal | head 1",
            id: getNextId()
        };

        let context = this;
        let res = await context.helper("create", [], create);
        res = await context.helper("cancel", [create.id], null);
    });

    it("List job properties", async function () {
        let create = {
            search: "search index=_internal | head 1",
            id: getNextId()
        };

        let context = this;
        await context.helper("create", [], create);
        await context.helper("list", [create.id], null);
        await context.helper("cancel", [create.id], null);
    });

    it("List job events", async function () {
        let create = {
            search: "search index=_internal | head 1",
            id: getNextId()
        };

        let context = this;
        await context.helper("create", [], create,);
        await context.helper("events", [create.id], null);
        await context.helper("cancel", [create.id], null);
    });

    it("List job preview", async function () {
        let create = {
            search: "search index=_internal | head 1",
            id: getNextId()
        };

        let context = this;
        await context.helper("create", [], create);
        await context.helper("preview", [create.id], null);
        await context.helper("cancel", [create.id], null);
    });

    it("List job results", async function () {
        let create = {
            search: "search index=_internal | head 1",
            id: getNextId()
        };

        let context = this;
        await context.helper("create", [], create);
        await context.helper("results", [create.id], null);
        await context.helper("cancel", [create.id], null);
    });

    it("List job results, by column", async function () {
        let create = {
            search: "search index=_internal | head 1",
            id: getNextId()
        };

        let context = this;
        await context.helper("create", [], create);
        await context.helper("results", [create.id], { output_mode: "json_cols" });
        await context.helper("cancel", [create.id], null);
    });

    it("Create+list multiple jobs", async function () {
        let creates = [];
        for (let i = 0; i < 3; i++) {
            creates[i] = {
                search: "search index=_internal | head 1",
                id: getNextId()
            };
        }
        let sids = creates.map(function (create) { return create.id; });

        let context = this;
        let [err, created] = await utils.parallelMap(
            creates,
            async function (create, idx) {
                let job = await context.helper("create", [], create);
                assert.ok(job);
                assert.strictEqual(job.sid, create.id);
                return [null, job];
            }
        );
            
        for (let i = 0; i < created.length; i++) {
            assert.strictEqual(creates[i].id, created[i].sid);
        }

        await context.helper("list", sids, null);
        await context.helper("cancel", sids, null);
    });
});

describe("Search Example Tests", function () {
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
