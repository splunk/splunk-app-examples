import Splunk from "./splunk_helpers.js";
import Config from "./setup_configuration.js";
import StoragePasswords from "./storage_passwords.js";

const CUSTOM_CONF = "weather";
const CUSTOM_CONF_STANZA = "api";

const SECRET_REALM = "weather_app_example_realm";
const SECRET_NAME = "admin";

export async function perform(splunk_js_sdk, setup_options) {
  let app_name = "weather_app_example";

  let application_name_space = {
    owner: "nobody",
    app: app_name,
    sharing: "app",
  };

  try {
    // Create the Splunk JS SDK Service object
    const splunk_js_sdk_service = Config.create_splunk_js_sdk_service(
      splunk_js_sdk,
      application_name_space
    );

    let { token, ...properties } = setup_options;

    // // Get conf and do stuff to it
    // await Splunk.update_configuration_file(
    //     splunk_js_sdk_service,
    //     CUSTOM_CONF,
    //     CUSTOM_CONF_STANZA,
    //     properties
    // )

    // Write token to passwords.conf
    await StoragePasswords.write_secret(
      splunk_js_sdk_service,
      SECRET_REALM,
      SECRET_NAME,
      token
    );

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
    console.log("Error:", error);
    alert("Error:" + error);
  }
}
