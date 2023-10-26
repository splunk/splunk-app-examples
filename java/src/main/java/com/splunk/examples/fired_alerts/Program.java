package com.splunk.examples.fired_alerts;

import com.splunk.*;

import java.util.Arrays;

public class Program {
    public static void main(String[] args) {
        Command command = Command.splunk("fired_alerts").parse(args);
        HttpService.setValidateCertificates(false);
        Service service = Service.connect(command.opts);

        FiredAlertGroupCollection firedAlertGroups = service.getFiredAlertGroups();
        for(FiredAlertGroup firedAlertGroup : firedAlertGroups.values()){
            System.out.println("\n" + firedAlertGroup.getPath());
            for(FiredAlert firedAlert : firedAlertGroup.getAlerts().values()){
                System.out.println("FiredAlert Name : " + firedAlert.getName());
                System.out.println("FiredAlert Action : " + Arrays.toString(firedAlert.getAction()));
                System.out.println("FiredAlert AlertType : " + firedAlert.getAlertType());
                System.out.println("FiredAlert ExpirationTime : " + firedAlert.getExpirationTime());
                System.out.println("FiredAlert SavedSearchName : " + firedAlert.getSavedSearchName());
                System.out.println("FiredAlert Severity : " + firedAlert.getSeverity());
                System.out.println("FiredAlert SID : " + firedAlert.getSid());
                System.out.println("FiredAlert TriggeredAlertCount : " + firedAlert.getTriggeredAlertCount());
                System.out.println("FiredAlert TriggerTime : " + firedAlert.getTriggerTime());
                System.out.println("FiredAlert IsDigestMode : " + firedAlert.isDigestMode() + "\n");
            }
        }
    }
}
