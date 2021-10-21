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
        let stage = 'Initializing the Splunk SDK for Javascript';
        try {
            // Initialize a Splunk Javascript SDK Service instance
            const http = new splunkjs.SplunkWebHttp();
            const service = new splunkjs.Service(
                http,
                appNamespace,
            );
            // Get app.conf configuration
            stage = 'Retrieving configurations SDK collection';
            const configCollection = service.configurations(appNamespace);
            await configCollection.fetch();
            stage = `Retrieving app.conf values for ${appName}`;
            const appConfig = configCollection.item('app');
            await appConfig.fetch();
            stage = `Retrieving app.conf [install] stanza values for ${appName}`;
            const installStanza = appConfig.item('install');
            await installStanza.fetch();
            // Verify that app is not already configured
            const isConfigured = installStanza.properties().is_configured;
            if (isTrue(isConfigured)) {
                console.warn(`App is configured already (is_configured=${isConfigured}), skipping setup page...`);
                reloadApp(service);
                redirectToApp();
            }
            // The storage passwords key = <realm>:<name>:
            stage = 'Retrieving storagePasswords SDK collection';
            const passKey = `${pwRealm}:${pwName}:`;
            const passwords = service.storagePasswords(appNamespace);
            await passwords.fetch();
            stage = `Checking for existing password for realm and password name = ${passKey}`;
            const existingPw = passwords.item(passKey);
            await existingPw;
            function passwordCallback(err, resp) {
                // Why use a callback here? Well the Javascript SDK doesn't
                // bind .create the way other methods are bound so await isn't an option
                if (err) throw err;
                stage = 'Setting app.conf [install] is_configured = 1'
                setIsConfigured(installStanza, 1);
                stage = `Reloading app ${appName} to register is_configured = 1 change`
                reloadApp(service);
                $('.success').show();
                stage = 'Redirecting to app home page'
                redirectToApp();
            }
            if (!existingPw) {
                // Secret doesn't exist, create new one
                stage = `Creating a new password for realm = ${pwRealm} and password name = ${pwName}`;
                passwords.create(
                    {
                        name: pwName,
                        password: passwordToSave,
                        realm: pwRealm,
                    }, passwordCallback);
            } else {
                // Secret exists, update to new value
                stage = `Updating existing password for realm = ${pwRealm} and password name = ${pwName}`;
                existingPw.update(
                    {
                        password: passwordToSave,
                    }, passwordCallback);
            }
        } catch (e) {
            console.warn(e);
            $('.error').show();
            $('#error_details').show();
            let errText = `Error encountered during stage: ${stage}<br>`;
            errText += (e.toString() === '[object Object]') ? '' : e.toString();
            if (e.hasOwnProperty('status')) errText += `<br>[${e.status}] `;
            if (e.hasOwnProperty('responseText')) errText += e.responseText;
            $('#error_details').html(errText);
        }
    }

    async function setIsConfigured(installStanza, val) {
        await installStanza.update({
            is_configured: val
        });
    }

    async function reloadApp(service) {
        // In order for the app to register that it has been configured
        // it first needs to be reloaded
        var apps = service.apps();
        await apps.fetch();

        var app = apps.item(appName);
        await app.fetch();
        await app.reload();
    }

    function redirectToApp(waitMs) {
        setTimeout(() => {
            window.location.href = `/app/${appName}`;
        }, 800); // wait 800ms and redirect
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
});