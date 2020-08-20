import { promisify } from './util.js'

async function write_secret(
  splunk_js_sdk_service,
  realm,
  name,
  secret,
) {
  // /servicesNS/<NAMESPACE_USERNAME>/<SPLUNK_APP_NAME>/storage/passwords/<REALM>%3A<NAME>%3A
  var storage_passwords_accessor = splunk_js_sdk_service.storagePasswords(
      {
          // No namespace information provided
      },
  );
  storage_passwords_accessor = await promisify(storage_passwords_accessor.fetch)()

  var password_exists = does_storage_password_exist(
    storage_passwords_accessor,
    realm,
    name,
  );

  if (password_exists) {
    delete_storage_password(
        storage_passwords_accessor,
        realm,
        name,
    );

  }

  // wait for password to be deleted
  while (password_exists) {
    storage_passwords_accessor = await promisify(storage_passwords_accessor.fetch)();

    password_exists = does_storage_password_exist(
      storage_passwords_accessor,
      realm,
      name,
    );
  }

  await create_storage_password_stanza(
      storage_passwords_accessor,
      realm,
      name,
      secret,
  );
}

function does_storage_password_exist(
  storage_passwords_accessor,
  realm,
  name,
) {
  var storage_passwords = storage_passwords_accessor.list();
  const password_id = realm + ":" + name + ":";

  for (var index = 0; index < storage_passwords.length; index++) {
    if (storage_passwords[index].name === password_id) {
      return true
    }
  }
  return false
};


function delete_storage_password(
  storage_passwords_accessor,
  realm,
  name,
) {
  // can't be promisified, for some reason
  return storage_passwords_accessor.del(realm + ":" + name + ":");
};

function create_storage_password_stanza(
  storage_passwords_accessor,
  realm,
  name,
  secret,
) {
  return promisify(storage_passwords_accessor.create)(
      {
          name: name,
          password: secret,
          realm: realm,
      }
  );
};

export {
  write_secret,
}
