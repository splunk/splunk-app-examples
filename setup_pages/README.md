# Overview of setup pages

A setup page is a page in your app that displays the first time your users launch the app. The setup page allows your users to configure app settings in Splunk Web.

In Splunk Cloud Platform, you must provide a setup page for app configuration. In Splunk Enterprise, you can provide a setup page as a best practice for app configuration.

## Use cases for setup pages

Here are some use cases for setup pages.

* You want to save user-provided configurations in a custom configuration (.conf) file in your app.
* You want to integrate your app with an external service, such as a third-party API.
* You want to check whether your app's dependencies are installed.

## Workflow for creating a setup page

Follow this workflow to create a setup page.

1. Write the JavaScript code to configure your app.
2. Create a Simple XML dashboard to surface the JavaScript code in your app.
3. Update your app's app.conf file to add the setup page to your app configuration.

## Setup page examples

This repository contains the following examples to help you get started creating setup pages.

## See also

* [Enable first-run configuration with setup pages in Splunk Cloud Platform or Splunk Enterprise](https://dev.splunk.com/enterprise/docs/developapps/manageknowledge/setuppage) in the Splunk *Developer Guide*.