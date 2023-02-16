# Overview of custom alert actions

Custom alert actions are user-defined alert actions that allow you to extend the Splunk platform with specialized alerting functionality. If your use case requires an alert response that is not natively supported by Splunk software, you can implement this response in a Python script and package the solution in a Splunk app.

For example, say you want to respond to an alert trigger with a customized log message. You can create a custom alert action to write this message to a specified log file when the alert is triggered by a saved search in Splunk Cloud Platform or Splunk Enterprise.

## Use cases for custom alert actions

Here are some use cases for custom alert actions.

- You want to send a customized notification to users following a change in data.
- You want to automate a response after a Splunk platform search detects a particular event.
- You want to gather additional information in response to event data.

## Workflow for creating a custom alert action

Follow this workflow to create a custom alert action.

1. Create an app in Splunk Enterprise and configure app settings for the custom alert action. 
2. Write the custom alert action script. 
3. Create the custom alert action configuration interface.

## Custom alert action examples

This repository contains the following example to help you get started creating setup pages.

| Example      | Description                                                                                             |
|--------------|---------------------------------------------------------------------------------------------------------|
| slack_alerts | Sends a customized message to a Slack channel based on a triggered alert action in the Splunk platform. |



## See also

- [Create custom alert actions for Splunk Cloud Platform or Splunk Enterprise](https://dev.splunk.com/enterprise/docs/devtools/customalertactions) in the Splunk *Developer Guide*