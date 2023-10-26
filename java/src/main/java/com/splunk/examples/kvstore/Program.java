package com.splunk.examples.kvstore;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.splunk.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Program {

    private static <T> T stringToJson(String data, Class<T> cls) {
        Gson gson = new Gson();
        return gson.fromJson(data, cls);
    }

    private static Args convertFieldToArgs(String fields) {
        Args args = new Args();
        String[] fieldArray = fields.split(",");
        for(String field : fieldArray) {
            String[] keyValuePair = field.split("=");
            args.put(keyValuePair[0].trim(), keyValuePair[1].trim());
        }
        return args;
    }

    private static Map<String, JsonObject> convertAcceleratedFieldToMap(String acceleratedFields) {
        Map<String,JsonObject> acceleratedFieldMap = new HashMap<>();
        String[] acceleratedFieldArray = acceleratedFields.split(",");
        for (String acceleratedField : acceleratedFieldArray) {
            String[] keyValuePair = acceleratedField.split("=");
            acceleratedFieldMap.put(keyValuePair[0].trim(), stringToJson(keyValuePair[1], JsonObject.class));
        }
        return acceleratedFieldMap;
    }

    private static void list(Service service) {
        KVStoreCollection kvStores = service.getKVStores();
        for(KVStore kvStore : kvStores.values()){
            System.out.println(kvStore.getName());
        }
    }

    private static void create(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }
        KVStore kvStore = kvStores.get(name);
        if (kvStore != null) {
            Command.error("KV Store " + name + " already exists!!!!");
            return;
        }
        kvStore = kvStores.create(name, args);
        System.out.println(kvStore.getName() + " created successfully!!!!");
    }

    private static void read(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name==null) {
            Command.error("Please provide the name of KV Store");
            return;
        }
        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }
        System.out.println(kvStore.getName() + "\n");
        for (Map.Entry<String, Object> entry : kvStore.entrySet()){
            System.out.println(entry.getKey() + " := " + entry.getValue());
        }
    }

    private static void update(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }
        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }

        if (!args.containsKey("field") && !args.containsKey("accelerated_fields")) Command.error("Please provide at least one of field or accelerated_fields");
        if (args.containsKey("field")) kvStore.updateFields(convertFieldToArgs((String) args.get("field")));
        if (args.containsKey("accelerated_fields")) kvStore.updateAcceleratedFields(convertAcceleratedFieldToMap((String) args.get("accelerated_fields")));
    }

    private static void delete(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }

        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }

        kvStores.remove(name);
    }

    private static void addData(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }

        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }

        String jsonData = (String) args.get("json_data");
        if (jsonData == null) {
            Command.error("Please provide the json_data for collection");
            return;
        }
        JsonObject jsonObject = stringToJson(jsonData, JsonObject.class);
        kvStore.addKVStoreData(jsonObject);
    }

    private static void readData(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }

        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }

        String query = (String) args.get("query");
        if (query != null) {
            args.remove("query");
            args.put("query", stringToJson(query, JsonObject.class));
        }

        String key = (String) args.get("key");
        if (key != null) System.out.println(kvStore.getKVStoreDataByKey(key));
        else System.out.println(kvStore.getKVStoreData(args).toString());
    }

    private static void updateData(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }

        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }

        String key = (String) args.get("key");
        if (key == null) {
            Command.error("Please provide the key to be updated");
            return;
        }

        String jsonData = (String) args.get("json_data");
        if (jsonData == null) {
            Command.error("Please provide the json_data for collection");
            return;
        }

        JsonObject jsonObject = stringToJson(jsonData, JsonObject.class);
        kvStore.updateKVStoreDataByKey(key, jsonObject);
    }

    private static void deleteData(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }

        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }

        String query = (String) args.get("query");
        if (query != null) {
            args.remove("query");
            args.put("query", stringToJson(query, JsonObject.class));
        }

        String key = (String) args.get("key");
        if (key != null) kvStore.deleteKVStoreDataByKey(key);
        else kvStore.deleteKVStoreData(args);
    }

    private static void batchSave(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }

        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }

        String jsonData = (String) args.get("json_data");
        if (jsonData == null) {
            Command.error("Please provide the json_data for collection");
            return;
        }
        JsonArray jsonArray = stringToJson(jsonData, JsonArray.class);
        kvStore.batchSaveKVStoreData(jsonArray);
    }

    private static void batchFind(Service service, Args args) {
        KVStoreCollection kvStores = service.getKVStores();
        String name = (String) args.get("name");
        if (name == null) {
            Command.error("Please provide the name of KV Store");
            return;
        }

        KVStore kvStore = kvStores.get(name);
        if (kvStore == null) {
            Command.error("KV Store " + name + " does not exists!!!!");
            return;
        }

        String jsonData = (String) args.get("json_data");
        if (jsonData == null) {
            Command.error("Please provide the json_data for collection");
            return;
        }

        List<Args> argsList = new ArrayList<>();
        JsonArray jsonArray = stringToJson(jsonData, JsonArray.class);
        for(JsonElement json : jsonArray) {
            Args arg = new Args();
            for(Map.Entry<String, JsonElement> entry: json.getAsJsonObject().entrySet()) {
                arg.put(entry.getKey(), entry.getValue());
            }
            argsList.add(arg);
        }
        System.out.println(kvStore.batchFindKVStoreData(argsList).toString());
    }

    public static void main(String[] args) {
        Command command = Command.splunk("kvstore");
        command.addRule("name", String.class,"Name of the KV Store");
        command.addRule("profiling_enabled", String.class, "A property that affects profilingThresholdMs.");
        command.addRule("profiling_threshold_ms", Integer.class, "Threshold for logging slow-running operations in milliseconds.");
        command.addRule("accelerated_fields", String.class, "A comma-separated list of the name of a field acceleration and its definition in JSON key value format. e.g \"accelerated_fields.a={\\\"pqr\\\": 1},accelerated_fields.b={\\\"lmn\\\": -1}\"");
        command.addRule("field", String.class, "A comma-separated list of the name of a field and its type. e.g \"field.a=array,field.b=number\"");
        command.addRule("json_data", String.class, "Collection data as a Json formatted string");
        command.addRule("fields", String.class, "Comma-separated list of fields to include (1) or exclude (0) for collection data.");
        command.addRule("shared", String.class, "Set to true to return records for the specified user as well as records for the nobody user for collection data.");
        command.addRule("limit", Integer.class, "Maximum number of items to return for collection data.");
        command.addRule("skip", Integer.class, "Number of items to skip from the start for collection data.");
        command.addRule("sort", String.class, "Sort order for collection data.");
        command.addRule("query", String.class, "Query JSON object for collection data.");
        command.addRule("key", String.class, "Key of the specific item in the collection");
        command.parse(args);
        HttpService.setValidateCertificates(false);

        if(!command.opts.containsKey("owner")) command.opts.put("owner", "nobody");
        if(!command.opts.containsKey("app")) command.opts.put("app", "search");
        Service service = Service.connect(command.opts);

        String name = null;
        if (command.opts.containsKey("name")) name = (String) command.opts.get("name");

        String profilingEnabled = null;
        if (command.opts.containsKey("profiling_enabled")) profilingEnabled = (String) command.opts.get("profiling_enabled");

        Integer profilingThresholdMs = null;
        if (command.opts.containsKey("profiling_threshold_ms")) profilingThresholdMs = (Integer) command.opts.get("profiling_threshold_ms");

        String acceleratedFields = null;
        if (command.opts.containsKey("accelerated_fields")) acceleratedFields = (String) command.opts.get("accelerated_fields");

        String field = null;
        if (command.opts.containsKey("field")) field = (String) command.opts.get("field");

        String jsonData = null;
        if (command.opts.containsKey("json_data")) jsonData = (String) command.opts.get("json_data");

        String fields = null;
        if (command.opts.containsKey("fields")) fields = (String) command.opts.get("fields");

        String shared = null;
        if (command.opts.containsKey("shared")) shared = (String) command.opts.get("shared");

        Integer limit = null;
        if (command.opts.containsKey("limit")) limit = (Integer) command.opts.get("limit");

        Integer skip = null;
        if (command.opts.containsKey("skip")) skip = (Integer) command.opts.get("skip");

        String sort = null;
        if (command.opts.containsKey("sort")) sort = (String) command.opts.get("sort");

        String query = null;
        if (command.opts.containsKey("query")) query = (String) command.opts.get("query");

        String key = null;
        if (command.opts.containsKey("key")) key = (String) command.opts.get("key");

        Args queryArgs = new Args();
        if (name != null) queryArgs.put("name", name);
        if (profilingEnabled != null) queryArgs.put("profilingEnabled", profilingEnabled);
        if (profilingThresholdMs != null) queryArgs.put("profilingThresholdMs", profilingThresholdMs);
        if (acceleratedFields != null) queryArgs.put("accelerated_fields", acceleratedFields);
        if (field != null) queryArgs.put("field", field);
        if (jsonData != null) queryArgs.put("json_data", jsonData);
        if (fields != null) queryArgs.put("fields", fields);
        if (shared != null) queryArgs.put("shared", shared);
        if (limit != null) queryArgs.put("limit", limit);
        if (skip != null) queryArgs.put("skip", skip);
        if (sort != null) queryArgs.put("sort", sort);
        if (query != null) queryArgs.put("query", query);
        if (key != null) queryArgs.put("key", key);

        if (command.args.length == 0) {
            list(service);
            return;
        }

        String action = command.args[0];

        if (command.args.length == 1) {
            if (action.equals("create")) {
                create(service, queryArgs);
                return;
            }

            if (action.equals("read")) {
                read(service, queryArgs);
                return;
            }

            if (action.equals("update")) {
                update(service, queryArgs);
                return;
            }

            if (action.equals("delete")) {
                delete(service, queryArgs);
                return;
            }

            if (action.equals("addData")) {
                addData(service, queryArgs);
                return;
            }

            if (action.equals("readData")) {
                readData(service, queryArgs);
                return;
            }

            if (action.equals("deleteData")) {
                deleteData(service, queryArgs);
                return;
            }

            if (action.equals("updateData")) {
                updateData(service, queryArgs);
                return;
            }

            if (action.equals("batchSave")) {
                batchSave(service, queryArgs);
                return;
            }

            if (action.equals("batchFind")) {
                batchFind(service, queryArgs);
                return;
            }
        }

        Command.error("Please enter a valid action");
    }
}
