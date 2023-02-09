
// Copyright 2015 Splunk, Inc.
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

// This example will show you how to add a new REST API endpoint
// to the Splunk SDK for JavaScript.
//
// The JavaScript SDK has the authorization roles REST API endpoint
// path defined, but doesn't implement it.
// To add a new path, we would add the following:
//
// `splunkjs.Paths.roles = "authorization/roles";`
//
// Be sure to avoid naming collisions!
//
// Depending on the endpoint, you may need to prepend `/services/`
// when defining the path.
// For example the server info REST API endpoint path is defined as:
//
// `"/services/server/info"`
//
// For more information, please refer to the REST API documentation
// at http://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTprolog

// Here we're adding a new entity to splunkjs, which will be
// used by the collection we'll add below.
splunkjs.Service.Role = splunkjs.Service.Entity.extend({
    path: function() {
        return splunkjs.Paths.roles + "/" + encodeURIComponent(this.name);
    },

    init: function(service, name, namespace) {
        this.name = name;
        this._super(service, this.path(), namespace);
    }
});

// Here we're adding a new collection to splunkjs, which
// uses the Role entity we just defined.
// See the `instantiateEntity()` function.
splunkjs.Service.Roles = splunkjs.Service.Collection.extend({
    fetchOnEntityCreation: true,
    
    path: function() {
        return splunkjs.Paths.roles;
    },

    instantiateEntity: function(props) {
        let entityNamespace = splunkjs.Utils.namespaceFromProperties(props);
        return new splunkjs.Service.Role(this.service, props.name, entityNamespace);
    },

    init: function(service, namespace) {
        this._super(service, this.path(), namespace);
    }
});

// To finish off integrating the new endpoint,
// we need to add a function to the service object
// which will retrieve the Roles collection.
splunkjs.Service.prototype.roles = function (namespace) {
    return new splunkjs.Service.Roles(this, namespace);
};

exports.main = async function (opts) {
    // This is just for testing - ignore it
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
        // Now that we're logged in, we can just retrieve system roles!
        let roles = await service.roles({ user: "admin", app: "search" }).fetch();
        console.log("System roles:");
        let rolesList = roles.list();
        for (let i = 0; i < rolesList.length; i++) {
            console.log("  " + i + " " + rolesList[i].name);
        }
    } catch (err) {
        console.log("There was an error retrieving the list of roles:", err);
        // For use by tests only
        if (module != require.main) {
            return Promise.reject(err);
        }
    }
};

if (module === require.main) {
    exports.main({});
}
