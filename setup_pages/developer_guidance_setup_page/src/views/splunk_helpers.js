// ----------------------------------
// Splunk JS SDK Helpers
// ----------------------------------
// ---------------------
// Process Helpers
// ---------------------
async function update_configuration_file(
  splunk_js_sdk_service,
  configuration_file_name,
  stanza_name,
  properties,
) {
  // Retrieve the accessor used to get a configuration file
  let splunk_js_sdk_service_configurations = splunk_js_sdk_service.configurations(
      {
          // Name space information not provided
      },
  );
  await splunk_js_sdk_service_configurations.fetch();

  // Check for the existence of the configuration file
  let configuration_file_exist = does_configuration_file_exist(
      splunk_js_sdk_service_configurations,
      configuration_file_name,
  );

  // If the configuration file doesn't exist, create it
  if (!configuration_file_exist) {
      await create_configuration_file(
          splunk_js_sdk_service_configurations,
          configuration_file_name,
      );

      // BUG WORKAROUND: re-fetch because the client doesn't do so
      await splunk_js_sdk_service_configurations.fetch();
  }

  // Retrieves the configuration file accessor
  let configuration_file_accessor = get_configuration_file(
      splunk_js_sdk_service_configurations,
      configuration_file_name,
  );
  await configuration_file_accessor.fetch();

  // Checks to see if the stanza where the inputs will be
  // stored exist
  let stanza_exist = does_stanza_exist(
      configuration_file_accessor,
      stanza_name,
  );

  // If the configuration stanza doesn't exist, create it
  if (!stanza_exist) {
      await create_stanza(configuration_file_accessor, stanza_name);
  }
  // Need to update the information after the creation of the stanza
  await configuration_file_accessor.fetch();

  // Retrieves the configuration stanza accessor
  let configuration_stanza_accessor = get_configuration_file_stanza(
      configuration_file_accessor,
      stanza_name,
  );
  await configuration_stanza_accessor.fetch();

  // We don't care if the stanza property does or doesn't exist
  // This is because we can use the
  // configurationStanza.update() function to create and
  // change the information of a property
  await update_stanza_properties(
      configuration_stanza_accessor,
      properties,
  );
};

async function create_configuration_file(
  configurations_accessor,
  configuration_file_name,
) {
  let _parent_context = this;

  return await configurations_accessor.create(configuration_file_name);
};

// ---------------------
// Existence Functions
// ---------------------
function does_configuration_file_exist(
  configurations_accessor,
  configuration_file_name,
) {
  let was_configuration_file_found = false;

  let configuration_files_found = configurations_accessor.list();
  for (let index = 0; index < configuration_files_found.length; index++) {
      let configuration_file_name_found =
          configuration_files_found[index].name;
      if (configuration_file_name_found === configuration_file_name) {
          was_configuration_file_found = true;
          break;
      }
  }

  return was_configuration_file_found;
};

function does_stanza_exist(
  configuration_file_accessor,
  stanza_name,
) {
  let was_stanza_found = false;

  let stanzas_found = configuration_file_accessor.list();
  for (let index = 0; index < stanzas_found.length; index++) {
      let stanza_found = stanzas_found[index].name;
      if (stanza_found === stanza_name) {
          was_stanza_found = true;
          break;
      }
  }

  return was_stanza_found;
};

// ---------------------
// Retrieval Functions
// ---------------------
function get_configuration_file(
  configurations_accessor,
  configuration_file_name,
) {
  let configuration_file_accessor = configurations_accessor.item(
      configuration_file_name,
      {
          // Name space information not provided
      },
  );

  return configuration_file_accessor;
};

function get_configuration_file_stanza(
  configuration_file_accessor,
  configuration_stanza_name,
) {
  let configuration_stanza_accessor = configuration_file_accessor.item(
      configuration_stanza_name,
      {
          // Name space information not provided
      },
  );

  return configuration_stanza_accessor;
};

async function create_stanza(
  configuration_file_accessor,
  new_stanza_name,
) {
  let parent_context = this;

  return await configuration_file_accessor.create(new_stanza_name);
};

async function update_stanza_properties(
  configuration_stanza_accessor,
  new_stanza_properties,
) {
  let parent_context = this;

  return await configuration_stanza_accessor.update(
      new_stanza_properties,
  );
};

export default {
  update_configuration_file,
}
