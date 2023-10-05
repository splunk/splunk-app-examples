package com.splunk.examples.event_types;

import com.splunk.*;

import java.util.Map;

public class Program {

    public static void main(String[] args) {
        Command command = Command.splunk("event_types").parse(args);
        HttpService.setValidateCertificates(false);
        Service service = Service.connect(command.opts);

        EventTypeCollection eventTypes = service.getEventTypes();
        for(EventType eventType : eventTypes.values()){
            System.out.println("\n" + eventType.getName());
            for(Map.Entry<String, Object> entry : eventType.entrySet()){
                System.out.println(entry.getKey() + " : " + entry.getValue());
            }
            System.out.println();
        }
    }
}
