package com.splunk.examples.conf;

import com.splunk.*;

public class Program {

    private static void list(Service service) {
        ConfCollection confs = service.getConfs();
        int count = 0;
        for (EntityCollection conf : confs.values()){

            System.out.println(count++ + "   " + conf.getName());
        }
    }

    private static void create(Service service, String name){
        ConfCollection confs = service.getConfs();
        if(confs.containsKey(name)){
            Command.error("Conf " + name + " already exists");
        }
        confs.create(name);
    }

    public static void main(String[] args){
        Command command = Command.splunk("conf").parse(args);
        Service.setValidateCertificates(false);
        Service service = Service.connect(command.opts);

        if(command.args.length == 0){
            list(service);
            return;
        }

        if(command.args.length != 2){
            Command.error("Action and conf-name required");
        }

        String action = command.args[0];
        String name = command.args[1];

        if(action.equals("create")){
            create(service,name);
            return;
        }

        Command.error("Please enter a valid action");
    }
}
