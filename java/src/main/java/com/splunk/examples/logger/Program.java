package com.splunk.examples.logger;

import com.splunk.*;

public class Program {
    public static void main(String[] args) {
        Command command = Command.splunk("logger").parse(args);
        HttpService.setValidateCertificates(false);
        Service service = Service.connect(command.opts);

        EntityCollection<Logger> loggers = service.getLoggers();
        for(Entity logger : loggers.values()){
            System.out.println(logger.getName() + " (" + logger.get("level") + ")");
        }
    }
}
