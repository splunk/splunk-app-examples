"use strict";

const appName = "setup_page_simple";
const appNamespace = {
    owner: "nobody",
    app: appName,
    sharing: "app",
};
const pwRealm = "setup_page_simple_realm";
const pwName = "password";

// Splunk Web Framework Provided files
require([
    "jquery", "splunkjs/splunk",
], function($, splunkjs) {
    console.log("setup_page.js require(...) called");
    // Register .on( "click", handler ) for "Complete Setup" button
    $("#setup_button").click(completeSetup);

    // onclick function for "Complete Setup" button from setup_page_dashboard.xml
    async function completeSetup() {
        console.log("setup_page.js completeSetup called");
        // Value of password_input from setup_page_dashboard.xml
        const passwordToSave = $('#password_input').val();
        try {
            // Initialize a Splunk Javascript SDK Service instance
            const http = new splunkjs.SplunkWebHttp();
            const service = new splunkjs.Service(
                http,
                appNamespace,
            );
            // Get app.conf configuration
            const configCollection = service.configurations(appNamespace);
            await configCollection.fetch();
            const appConfig = configCollection.item('app');
            await appConfig.fetch();
            const installStanza = appConfig.item('install');
            await installStanza.fetch();
            // Verify that app is not already configured
            const isConfigured = installStanza.properties().is_configured;
            if (isTrue(isConfigured)) {
                console.warn(`App is configured already (is_configured=${isConfigured}), skipping setup page...`);
                redirectToApp();
            }
            // The storage passwords key = <realm>:<name>:
            const passKey = `${pwRealm}:${pwName}:`;
            const passwords = service.storagePasswords(appNamespace);
            await passwords.fetch();
            const existingPw = passwords.item(passKey);
            await existingPw;
            if (!existingPw) {
                // Secret doesn't exist, create new one
                passwords.create(
                    {
                        name: pwName,
                        password: passwordToSave,
                        realm: pwRealm,
                    }, (err, resp) => {
                        if (err) throw err;
                        console.log(resp);
                        $('.success').show();
                        redirectToApp();
                    }
                );
            } else {
                // Secret exists, update to new value
                existingPw.update(
                    {
                        password: passwordToSave,
                    }, (err, resp) => {
                        if (err) throw err;
                        console.log(resp);
                        $('.success').show();
                        redirectToApp();
                    }
                );
            }
            
        } catch (e) {
            console.warn(e);
            $('.error').show();
            $('#error_details').html(e);
            redirectToApp();
        }
    }

    function isTrue(v) {
        if (typeof(v) === typeof(true)) return v;
        if (typeof(v) === typeof(1)) return v!==0;
        if (typeof(v) === typeof('true')) {
            if (v.toLowerCase() === 'true') return true;
            if (v === 't') return true;
            if (v === '1') return true;
        }
        return false;
    }

    function redirectToApp() {
        setTimeout(() => {
            window.location.href = `/app/${appName}`;
        }, 500); // wait 500ms and redirect
    }
});