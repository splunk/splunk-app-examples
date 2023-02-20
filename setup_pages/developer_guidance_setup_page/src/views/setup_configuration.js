import SplunkHelpers from './splunk_helpers'

async function create_custom_configuration_file(
  splunk_js_sdk_service,
  api_url,
) {
  let custom_configuration_file_name = "setup_page_example";
  let stanza_name = "example_stanza";
  let properties_to_update = {
      api_url: api_url,
  };

  await SplunkHelpers.update_configuration_file(
      splunk_js_sdk_service,
      custom_configuration_file_name,
      stanza_name,
      properties_to_update,
  );
};

async function complete_setup(splunk_js_sdk_service) {
  let configuration_file_name = "app";
  let stanza_name = "install";
  let properties_to_update = {
      is_configured: "true",
  };

  await SplunkHelpers.update_configuration_file(
      splunk_js_sdk_service,
      configuration_file_name,
      stanza_name,
      properties_to_update,
  );
};

async function reload_splunk_app(
  splunk_js_sdk_service,
  app_name,
) {
  let splunk_js_sdk_apps = splunk_js_sdk_service.apps();
  await splunk_js_sdk_apps.fetch();

  let current_app = splunk_js_sdk_apps.item(app_name);
  await current_app.reload();
};

function redirect_to_splunk_app_homepage(
  app_name,
) {
  let redirect_url = "/app/" + app_name;

  window.location.href = redirect_url;
};


function create_splunk_js_sdk_service(
  splunk_js_sdk,
  application_name_space,
) {
  let http = new splunk_js_sdk.SplunkWebHttp();

  let splunk_js_sdk_service = new splunk_js_sdk.Service(
      http,
      application_name_space,
  );

  return splunk_js_sdk_service;
};

export default {
  create_custom_configuration_file,
  complete_setup,
  reload_splunk_app,
  redirect_to_splunk_app_homepage,
  create_splunk_js_sdk_service,
}
