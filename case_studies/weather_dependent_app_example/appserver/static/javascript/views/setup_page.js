"use strict";

import * as Splunk from './splunk_helpers.js'
import * as Config from './setup_configuration.js'
import * as StoragePasswords from './storage_passwords.js'

const CUSTOM_CONF = 'weather'
const CUSTOM_CONF_STANZA = 'api'

const SECRET_REALM = 'weather_dependent_app_realm'
const SECRET_NAME = 'admin'

export async function perform(splunk_js_sdk, setup_options) {
    var app_name = "weather_dependent_app_example";

    var application_name_space = {
        owner: "nobody",
        app: app_name,
        sharing: "app",
    };

    try {
        // Create the Splunk JS SDK Service object
        const splunk_js_sdk_service = Config.create_splunk_js_sdk_service(
            splunk_js_sdk,
            application_name_space,
        );

        let configured = false
        const dependent_app_name = "weather_app_example"

        var apps = await Config.list_apps(splunk_js_sdk_service);
        var current_app = apps.item(dependent_app_name);
       
        if (current_app.properties().configured == true) {
            configured = true
        } else {
            alert('Error:' + 'Dependent weather_app_example is not installed!');
        }
        let version = parseInt(current_app.properties().version)

        if (version < 1) {
            alert('Error:' + 'Upgrade weather app version to atleast 1.0!');
        }
       
        if (configured && version >= 1) {
            console.log('dependencies installed!')
            await Config.complete_setup(splunk_js_sdk_service);

        // Reloads the splunk app so that splunk is aware of the
        // updates made to the file system
            await Config.reload_splunk_app(splunk_js_sdk_service, app_name);

            Config.redirect_to_splunk_app_homepage(app_name);
        } else {
            console.log('Dependencies  not installed!')
            alert('Fix dependencies and continue set up.')
        }
        
    } catch (error) {
        // This could be better error catching.
        // Usually, error output that is ONLY relevant to the user
        // should be displayed. This will return output that the
        // user does not understand, causing them to be confused.
        console.log('Error:', error);
        alert('Error:' + error);
    }
}
