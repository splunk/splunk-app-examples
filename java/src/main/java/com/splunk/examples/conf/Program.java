package com.splunk.examples.conf;

import com.splunk.*;

import java.util.Map;

public class Program {

    private static void list(Service service) {
        ConfCollection confs = service.getConfs();
        for (EntityCollection<Entity> conf : confs.values()){
            System.out.println(conf.getName());
        }
    }

    private static void createStanza(Service service, String confName, String stanzaName){
        ConfCollection confs = service.getConfs();
        EntityCollection<Entity> conf = confs.get(confName);
        if(conf == null) {
            Command.error("Conf " + confName + " does not exists");
            return;
        }
        if(conf.containsKey(stanzaName)){
            Command.error("Stanza " + stanzaName + " already exists in the Conf " + confName);
            return;
        }
        conf.create(stanzaName);
    }

    private static void readStanza(Service service, String confName, String stanzaName){
        ConfCollection confs = service.getConfs();
        EntityCollection<Entity> conf = confs.get(confName);
        if(conf == null){
            Command.error("Conf " + confName + " does not exists");
            return;
        }
        Entity stanza = conf.get(stanzaName);
        if(stanza == null){
            Command.error("Stanza " + stanzaName + " does not exists in the Conf " + confName);
            return;
        }
        for (Map.Entry<String, Object> entry: stanza.entrySet()) {
            System.out.println(entry.getKey() + " := " + entry.getValue());
        }
    }

    private static void updateStanza(Service service, String confName, String stanzaName, Args args){
        ConfCollection confs = service.getConfs();
        EntityCollection<Entity> conf = confs.get(confName);
        if(conf == null){
            Command.error("Conf " + confName + " does not exists");
            return;
        }
        Entity stanza = conf.get(stanzaName);
        if(stanza == null){
            Command.error("Stanza " + stanzaName + " does not exists in the Conf " + confName);
            return;
        }
        stanza.update(args);
    }

    private static void deleteStanza(Service service, String confName, String stanzaName){
        ConfCollection confs = service.getConfs();
        EntityCollection<Entity> conf = confs.get(confName);
        if(conf == null){
            Command.error("Conf " + confName + " does not exists");
            return;
        }
        Entity stanza = conf.get(stanzaName);
        if(stanza == null){
            Command.error("Stanza " + stanzaName + " does not exists in the Conf " + confName);
            return;
        }
        stanza.remove();
    }

    private static void createConf(Service service, String confName){
        ConfCollection confs = service.getConfs();
        if(confs.containsKey(confName)) {
            Command.error("Conf " + confName + " already exists");
        }
        confs.create(confName);
    }

    private static void readConf(Service service, String confName){
        ConfCollection confs = service.getConfs();
        EntityCollection<Entity> conf = confs.get(confName);
        if(conf == null) {
            Command.error("Conf " + confName + " does not exists");
            return;
        }
        System.out.println("\n" + conf.getName());
        for(Entity stanza : conf.values()){
            System.out.println("[" + stanza.getName() + "]");
        }
    }

    public static void main(String[] args){
        Command command = Command.splunk("conf").parse(args);
        HttpService.setValidateCertificates(false);
        Service service = Service.connect(command.opts);
        EntityCollection<Application> apps = service.getApplications();
        if(!apps.containsKey("example-app")){
            apps.create("example-app");
        }
        Args applicationArgs = new Args(command.opts);
        applicationArgs.put("sharing", "app");
        applicationArgs.put("owner", "nobody");
        applicationArgs.put("app", "example-app");
        Service appService = Service.connect(applicationArgs);


        if (command.args.length == 0){
            list(appService);
            return;
        }

        String action = command.args[0];

        if (command.args.length == 2 && action.equals("create")) {
            String confName = command.args[1];
            createConf(appService, confName);
            return;
        }

        if (command.args.length == 2 && action.equals("read")) {
            String confName = command.args[1];
            readConf(appService, confName);
            return;
        }

        if(command.args.length == 3 && (action.equals("create") || action.equals("delete") || action.equals("read"))) {

            String confName = command.args[1];
            String stanzaName = command.args[2];

            if (action.equals("create")) {
                createStanza(appService, confName, stanzaName);
                return;
            }

            if (action.equals("read")) {
                readStanza(appService, confName, stanzaName);
                return;
            }

            deleteStanza(appService, confName, stanzaName);
            return;
        }

        if(command.args.length == 4 && action.equals("update")) {
            String confName = command.args[1];
            String stanzaName = command.args[2];
            String data = command.args[3];

            String[] keyValuePairs = data.split(",");

            Args queryArgs = new Args();

            for (String pair : keyValuePairs){
                String[] entry = pair.split("=");
                if(entry.length!=2){
                    Command.error("Please provide valid body for update");
                    return;
                }
                queryArgs.put(entry[0],entry[1]);
            }

            updateStanza(appService, confName, stanzaName, queryArgs);
            return;
        }

        Command.error("Please enter a valid action");
    }
}
