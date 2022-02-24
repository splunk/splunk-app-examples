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

(function() {
    let path         = require('path');
    let fs           = require('fs');
    let commander    = require('splunk-sdk/contrib/commander');
    let utils        = require('splunk-sdk/lib/utils');
    
    let DEFAULTS_PATHS = [
        process.env.HOME || process.env.HOMEPATH,
        path.resolve(__dirname, "..")
    ];
    
    let readDefaultsFile = function(path, defaults) {
        let contents = fs.readFileSync(path, "utf8") || "";
        let lines = contents.split("\n") || [];
        
        for(let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line !== "" && !utils.startsWith(line, "#")) {
                let parts = line.split("=");
                let key = parts[0].trim();
                let value = parts[1].trim();
                defaults[key] = value;
            }
        }
    };
    
    let getDefaults = function() {
        let defaults = {};
        for(let i = 0; i < DEFAULTS_PATHS.length; i++) {
            let defaultsPath = path.join(DEFAULTS_PATHS[i], ".splunkrc");
            if (fs.existsSync(defaultsPath)) {
                readDefaultsFile(defaultsPath, defaults);
            }
        }
        
        return defaults;
    };
    
    module.exports.create = function() {
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
        
        parser.parse = function(argv) {
            argv = (argv || []).slice(2);
            let defaults = getDefaults();
            for(let key in defaults) {
                if (defaults.hasOwnProperty(key) && argv.indexOf("--" + key) < 0) {
                    let value = defaults[key];
                    argv.unshift(value);
                    argv.unshift("--" + key.trim());
                }
            }
            
            argv.unshift("");
            argv.unshift("");
            
            let cmdline = parse.call(parser, argv);
            
            return cmdline;
        };
        
        parser.add = function(commandName, description, args, flags, required_flags, onAction) {
            let opts = {};
            flags = flags || [];
            
            let command = parser.command(commandName + (args ? " " + args : "")).description(description || "");
            
            // For each of the flags, add an option to the parser
            for(let i = 0; i < flags.length; i++) {
                let required = required_flags.indexOf(flags[i]) >= 0;
                let option = "<" + flags[i] + ">";
                command.option("--" + flags[i] + " " + option, "", undefined, required);
            }
            
            command.action(function() {
                let args = utils.toArray(arguments);
                args.unshift(commandName);
                onAction.apply(null, args);
            });
        };
        
        return parser;
    };
})();