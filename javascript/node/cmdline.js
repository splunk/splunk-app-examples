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
    let path = require('path');
    let fs = require('fs');
    let commander = require('splunk-sdk/contrib/commander');
    let utils = require('splunk-sdk/lib/utils');

    let DEFAULTS_PATHS = [
        process.env.HOME || process.env.HOMEPATH,
        path.resolve(__dirname, "..")
    ];

    let readDefaultsFile = function (path, defaults) {
        let contents = fs.readFileSync(path, "utf8") || "";
        let lines = contents.split("\n") || [];

        for (let line of lines) {
            line = line.trim();
            if (line !== "" && !utils.startsWith(line, "#")) {
                let parts = line.split("=");
                let key = parts[0].trim();
                let value = parts[1].trim();
                defaults[key] = value;
            }
        }
    };

    let getDefaults = function () {
        let defaults = {};

        for (const defaultPath of DEFAULTS_PATHS) {
            let defaultsPath = path.join(defaultPath, '.splunkrc');
            if (fs.existsSync(defaultsPath)) {
                readDefaultsFile(defaultsPath, defaults);
            }
        }

        return defaults;
    };

    module.exports.create = function () {
        let parser = new commander.Command();
        let parse = parser.parse;

        parser.password = undefined;

        parser
            .option('-u, --username <username>', "Username to login with", undefined, true)
            .option('--password <password>', "Username to login with", undefined, false)
            .option('--scheme <scheme>', "Scheme to use", "https", false)
            .option('--host <host>', "Hostname to use", "localhost", false)
            .option('--port <port>', "Port to use", 8089, false)
            .option('--version <version>', "Which version to use", "4", false);

        parser.parse = async function (argv) {
            argv = (argv || []).slice(2);
            let defaults = getDefaults();
            for (const key in defaults) {
                if (defaults.hasOwnProperty(key) && argv.indexOf("--" + key) < 0) {
                    let value = defaults[key];
                    argv.unshift(value);
                    argv.unshift("--" + key.trim());
                }
            }

            argv.unshift("");
            argv.unshift("");

            return await parse.call(parser, argv);
        };

        parser.add = async function (commandName, description, args, flags, required_flags, onAction) {

            flags = flags || [];

            let command = parser.command(commandName + (args ? " " + args : "")).description(description || "");

            // For each of the flags, add an option to the parser
            for (const flag of flags) {
                let required = required_flags.indexOf(flag) >= 0;
                let option = "<" + flag + ">";
                command.option("--" + flag + " " + option, "", undefined, required);
            }

            return await command.action(function () {
                let args = utils.toArray(arguments);
                args.unshift(commandName);
                onAction.apply(null, args);
            });
        };

        return parser;
    };
})();
