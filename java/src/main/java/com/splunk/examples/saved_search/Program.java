package com.splunk.examples.saved_search;

import com.splunk.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;

public class Program {

    private static void list(Service service){
        SavedSearchCollection savedSearches = service.getSavedSearches();
        for(SavedSearch savedSearch : savedSearches.values()){
            System.out.println(savedSearch.getTitle() + "\n" + "    (" + savedSearch.getSearch()+ ")\n\n");
        }
    }

    private static void create(Service service, Args args){
        String savedSearchSearch = (String) args.get("search");
        if(savedSearchSearch == null){
            Command.error("Please provide the search expression of saved search");
            return;
        }
        SavedSearchCollection savedSearches = service.getSavedSearches();
        String savedSearchName = (String) args.get("name");
        SavedSearch savedSearch = savedSearches.get(savedSearchName);
        if (savedSearch != null) {
            Command.error("Saved search '" + savedSearchName + "' already exists");
            return;
        }
        savedSearches.create(savedSearchName, args);
    }

    private static void read(Service service, Args args){
        SavedSearchCollection savedSearches = service.getSavedSearches();
        String savedSearchName = (String) args.get("name");
        SavedSearch savedSearch = savedSearches.get(savedSearchName);
        if (savedSearch == null) {
            Command.error("Saved search '" + savedSearchName + "' does not exists");
            return;
        }
        System.out.println(savedSearch.getName() + "\n");
        for(Map.Entry<String,Object> entry : savedSearch.entrySet()){
            System.out.println(entry.getKey() + " : " + entry.getValue());
        }
    }

    private static void update(Service service, Args args){
        SavedSearchCollection savedSearches = service.getSavedSearches();
        String savedSearchName = (String) args.get("name");
        SavedSearch savedSearch = savedSearches.get(savedSearchName);
        if (savedSearch == null) {
            Command.error("Saved search '" + savedSearchName + "' does not exists");
            return;
        }
        args.remove("name");
        savedSearch.update(args);
    }

    private static void delete(Service service, Args args){
        SavedSearchCollection savedSearches = service.getSavedSearches();
        String savedSearchName = (String) args.get("name");
        SavedSearch savedSearch = savedSearches.get(savedSearchName);
        if (savedSearch == null) {
            Command.error("Saved search '" + savedSearchName + "' does not exists");
            return;
        }
        savedSearch.remove();
    }

    public static void main(String[] args) {
        Command command = Command.splunk("saved_search");
        command.addRule("name", String.class,"Name of search name to be created");
        command.addRule("search", String.class, "Splunk search string");
        command.addRule("is_visible", String.class, "Should the saved search appear under the Seaches & Report menu (defaults to true)");
        command.addRule("is_scheduled", String.class, "Does the saved search run on the saved schedule.");
        command.addRule("max_concurrent", String.class, "If the search is ran by the scheduler how many concurrent instances of this search is the scheduler allowed to run (defaults to 1)");
        command.addRule("realtime_schedule", String.class, "Is the scheduler allowed to skip executions of this saved search, if there is not enough search bandwidtch (defaults to true), set to false only for summary index populating searches");
        command.addRule("run_on_startup", String.class, "Should the scheduler run this saved search on splunkd start up (defaults to false)");
        command.addRule("cron_schedule", String.class, "The cron formatted schedule of the saved search. Required for Alerts");
        command.addRule("alert_type", String.class, "The thing to count a quantity of in relation to relation. Required for Alerts.");
        command.addRule("alert_threshold", String.class, "The quantity of counttype must exceed in relation to relation. Required for Alerts.");
        command.addRule("alert_comparator", String.class, "The relation the count type has to the quantity. Required for Alerts.");
        command.addRule("actions", String.class, "A list of the actions to fire on alert; supported values are {(email, rss) | script}. For example, actions = rss,email would enable both RSS feed and email sending. Or if you want to just fire a script: actions = script");
        command.addRule("action.email.to", String.class, "The email to which actions sends data");
        command.addRule("action.email.sender", String.class, "The email of the sender of action data");
        command.addRule("action.script.filename", String.class, "The filename of the script");
        command.addRule("dispatch.ttl", String.class, "The TTL of the search job created");
        command.addRule("dispatch.buckets", String.class, "The number of event buckets");
        command.addRule("dispatch.max_count", String.class, "Maximum number of results");
        command.addRule("dispatch.max_time", String.class, "Maximum amount of time in seconds before finalizing the search");
        command.addRule("dispatch.lookups", String.class, "Boolean flag indicating whether to enable lookups in this search");
        command.addRule("dispatch.spawn_process", String.class, "Boolean flag whether to spawn the search as a separate process");
        command.addRule("dispatch.time_format", String.class, "Format string for earliest/latest times");
        command.addRule("dispatch.earliest_time", String.class, "The earliest time for the search");
        command.addRule("dispatch.latest_time", String.class, "The latest time for the search");
        command.addRule("alert.expires", String.class, "The period of time for which the alert will be shown in the alert's dashboard");
        command.addRule("alert.severity", String.class, "Specifies the alert severity level, valid values are: 1-debug, 2-info, 3-warn, 4-error, 5-severe, 6-fatal");
        command.addRule("alert.suppress", String.class, "whether alert suppression is enabled for this scheduled search");
        command.addRule("alert.suppress.period", String.class, "suppression period, use ack to suppress until acknowledgment is received");
        command.addRule("alert.digest", String.class, "whether the alert actions are executed on the entire result set or on each individual result (defaults to true)");
        command.addRule("output_mode", String.class, "type of output (atom, xml)");
        command.parse(args);
        HttpService.setValidateCertificates(false);
        Service service = Service.connect(command.opts);


        String name = null;
        if (command.opts.containsKey("name")){
            name = (String) command.opts.get("name");
        }

        String search = null;
        if (command.opts.containsKey("search")){
            search = (String) command.opts.get("search");
        }

        String isVisible = null;
        if (command.opts.containsKey("is_visible")){
            isVisible = (String) command.opts.get("is_visible");
        }

        String isScheduled = null;
        if (command.opts.containsKey("is_scheduled")){
            isScheduled = (String) command.opts.get("is_scheduled");
        }

        String maxConcurrent = null;
        if (command.opts.containsKey("max_concurrent")){
            maxConcurrent = (String) command.opts.get("max_concurrent");
        }

        String realtimeSchedule = null;
        if (command.opts.containsKey("realtime_schedule")){
            realtimeSchedule = (String) command.opts.get("realtime_schedule");
        }

        String runOnStartup = null;
        if (command.opts.containsKey("run_on_startup")){
            runOnStartup = (String) command.opts.get("run_on_startup");
        }

        String cronSchedule = null;
        if (command.opts.containsKey("cron_schedule")){
            cronSchedule = (String) command.opts.get("cron_schedule");
        }

        String alertType = null;
        if (command.opts.containsKey("alert_type")){
            alertType = (String) command.opts.get("alert_type");
        }

        String alertThreshold = null;
        if (command.opts.containsKey("alert_threshold")){
            alertThreshold = (String) command.opts.get("alert_threshold");
        }

        String alertComparator = null;
        if (command.opts.containsKey("alert_comparator")){
            alertComparator = (String) command.opts.get("alert_comparator");
        }

        String actions = null;
        if (command.opts.containsKey("actions")){
            actions = (String) command.opts.get("actions");
        }

        String actionEmailTo = null;
        if (command.opts.containsKey("action.email.to")){
            actionEmailTo = (String) command.opts.get("action.email.to");
        }

        String actionEmailSender = null;
        if (command.opts.containsKey("action.email.sender")){
            actionEmailSender = (String) command.opts.get("action.email.sender");
        }

        String actionScriptFilename = null;
        if (command.opts.containsKey("action.script.filename")){
            actionScriptFilename = (String) command.opts.get("action.script.filename");
        }

        String dispatchTtl = null;
        if (command.opts.containsKey("dispatch.ttl")){
            dispatchTtl = (String) command.opts.get("dispatch.ttl");
        }

        String dispatchBuckets = null;
        if (command.opts.containsKey("dispatch.buckets")){
            dispatchBuckets = (String) command.opts.get("dispatch.buckets");
        }

        String dispatchMaxCount = null;
        if (command.opts.containsKey("dispatch.max_count")){
            dispatchMaxCount = (String) command.opts.get("dispatch.max_count");
        }

        String dispatchMaxTime = null;
        if (command.opts.containsKey("dispatch.max_time")){
            dispatchMaxTime = (String) command.opts.get("dispatch.max_time");
        }

        String dispatchLookups = null;
        if (command.opts.containsKey("dispatch.lookups")){
            dispatchLookups = (String) command.opts.get("dispatch.lookups");
        }

        String dispatchSpawnProcess = null;
        if (command.opts.containsKey("dispatch.spawn_process")){
            dispatchSpawnProcess = (String) command.opts.get("dispatch.spawn_process");
        }

        String dispatchTimeFormat = null;
        if (command.opts.containsKey("dispatch.time_format")){
            dispatchTimeFormat = (String) command.opts.get("dispatch.time_format");
        }

        String dispatchEarliestTime = null;
        if (command.opts.containsKey("dispatch.earliest_time")){
            dispatchEarliestTime = (String) command.opts.get("dispatch.earliest_time");
        }

        String dispatchLatestTime = null;
        if (command.opts.containsKey("dispatch.latest_time")){
            dispatchLatestTime = (String) command.opts.get("dispatch.latest_time");
        }

        String alertExpires = null;
        if (command.opts.containsKey("alert.expires")){
            alertExpires = (String) command.opts.get("alert.expires");
        }

        String alertSeverity = null;
        if (command.opts.containsKey("alert.severity")){
            alertSeverity = (String) command.opts.get("alert.severity");
        }

        String alertSuppress = null;
        if (command.opts.containsKey("alert.suppress")){
            alertSuppress = (String) command.opts.get("alert.suppress");
        }

        String alertSuppressPeriod = null;
        if (command.opts.containsKey("alert.suppress.period")){
            alertSuppressPeriod = (String) command.opts.get("alert.suppress.period");
        }

        String alertDigest = null;
        if (command.opts.containsKey("alert.digest")){
            alertDigest = (String) command.opts.get("alert.digest");
        }

        String outputMode = null;
        if (command.opts.containsKey("output_mode")){
            outputMode = (String) command.opts.get("output_mode");
        }

        Args queryArgs = new Args();
        if (name != null) queryArgs.put("name", name);
        if (search != null) queryArgs.put("search", search);
        if (isVisible != null) queryArgs.put("is_visible", isVisible);
        if (isScheduled != null) queryArgs.put("is_scheduled", isScheduled);
        if (maxConcurrent != null) queryArgs.put("max_concurrent", maxConcurrent);
        if (realtimeSchedule != null) queryArgs.put("realtime_schedule", realtimeSchedule);
        if (runOnStartup != null) queryArgs.put("run_on_startup", runOnStartup);
        if (cronSchedule != null) queryArgs.put("cron_schedule", cronSchedule);
        if (alertType != null) queryArgs.put("alert_type", alertType);
        if (alertThreshold != null) queryArgs.put("alert_threshold", alertThreshold);
        if (alertComparator != null) queryArgs.put("alert_comparator", alertComparator);
        if (actions != null) queryArgs.put("actions", actions);
        if (actionEmailTo != null) queryArgs.put("action.email.to", actionEmailTo);
        if (actionEmailSender != null) queryArgs.put("action.email.sender", actionEmailSender);
        if (actionScriptFilename != null) queryArgs.put("action.script.filename", actionScriptFilename);
        if (dispatchTtl != null) queryArgs.put("dispatch.ttl", dispatchTtl);
        if (dispatchBuckets != null) queryArgs.put("dispatch.buckets", dispatchBuckets);
        if (dispatchMaxCount != null) queryArgs.put("dispatch.max_count", dispatchMaxCount);
        if (dispatchMaxTime != null) queryArgs.put("dispatch.max_time", dispatchMaxTime);
        if (dispatchLookups != null) queryArgs.put("dispatch.lookups", dispatchLookups);
        if (dispatchSpawnProcess != null) queryArgs.put("dispatch.spawn_process", dispatchSpawnProcess);
        if (dispatchTimeFormat != null) queryArgs.put("dispatch.time_format", dispatchTimeFormat);
        if (dispatchEarliestTime != null) queryArgs.put("dispatch.earliest_time", dispatchEarliestTime);
        if (dispatchLatestTime != null) queryArgs.put("dispatch.latest_time", dispatchLatestTime);
        if (alertExpires != null) queryArgs.put("alert.expires", alertExpires);
        if (alertSeverity != null) queryArgs.put("alert.severity", alertSeverity);
        if (alertSuppress != null) queryArgs.put("alert.suppress", alertSuppress);
        if (alertSuppressPeriod != null) queryArgs.put("alert.suppress.period", alertSuppressPeriod);
        if (alertDigest != null) queryArgs.put("alert.digest", alertDigest);
        if (outputMode != null) queryArgs.put("output_mode", outputMode);


        if (command.args.length == 0) {
            list(service);
            return;
        }

        if (name == null) {
            Command.error("Please provide the name of saved search");
            return;
        }
        String action = command.args[0];
        HashSet<String> set = new HashSet<>(Arrays.asList("create", "read", "update", "delete"));

        if (command.args.length == 1 && set.contains(action)) {
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
        }

        Command.error("Please enter a valid action");
    }
}
