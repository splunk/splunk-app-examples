async function write_secret(splunk_js_sdk_service, realm, name, secret) {
  // /servicesNS/<NAMESPACE_USERNAME>/<SPLUNK_APP_NAME>/storage/passwords/<REALM>%3A<NAME>%3A
  let storage_passwords_accessor = splunk_js_sdk_service.storagePasswords({
    // No namespace information provided
  });
  storage_passwords_accessor = await storage_passwords_accessor.fetch();
  await storage_passwords_accessor.createV2({
    name: name,
    password: secret,
    realm: realm,
  });
}

export default {
  write_secret
};