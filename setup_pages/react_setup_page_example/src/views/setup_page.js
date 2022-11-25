import Splunk from './splunk_helpers'
import Config from './setup_configuration'

const MACROS_CONF = 'macros'

export async function perform(splunk_js_sdk, setup_options) {
    let app_name = "react_setup_page_example";

    let application_name_space = {
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

        let { stanza, ...properties } = setup_options;

        // Get macros.conf and do stuff to it
        await Splunk.update_configuration_file(
            splunk_js_sdk_service,
            MACROS_CONF,
            stanza,
            properties
        )

        // Completes the setup, by access the app.conf's [install]
        // stanza and then setting the `is_configured` to true
        await Config.complete_setup(splunk_js_sdk_service);

        // Reloads the splunk app so that splunk is aware of the
        // updates made to the file system
        await Config.reload_splunk_app(splunk_js_sdk_service, app_name);

        // Redirect to the Splunk App's home page
        Config.redirect_to_splunk_app_homepage(app_name);
    } catch (error) {
        // This could be better error catching.
        // Usually, error output that is ONLY relevant to the user
        // should be displayed. This will return output that the
        // user does not understand, causing them to be confused.
        alert('Error:' + error);
    }
}
