# Overview of custom REST endpoints

Custom REST endpoints are user-defined endpoints that let you extend the Splunk platform REST API in your app. You can use the Splunk Enterprise REST API to programmatically interact with Splunk Enterprise using HTTP GET, POST, PUT, and DELETE operations. Create a custom endpoint to introduce additional capabilities into the Splunk Enterprise REST API to meet your specific needs.

## Types of custom REST endpoints

Here are the two types of custom REST endpoints, along with their associated use cases.

| Type                                      | Use case                                                                    |
|-------------------------------------------|-----------------------------------------------------------------------------|
| Script interface                          | You want to introduce new functionality into your app through the REST API. |
| Extensible Administration Interface (EAI) | You want to manage your app's custom configuration files.                   |

## Workflow for creating a custom REST endpoint

Follow this workflow to create a custom REST endpoint.

1. Write the Python script for your custom REST handler.
2. Map your custom REST handler to an endpoint.
3. Expose the endpoint to your app's users.

## Custom REST endpoint examples

This repository contains the following examples to help you get started creating custom REST endpoints.

| Example     | Description                                                                                                        |
|-------------|--------------------------------------------------------------------------------------------------------------------|
| hello-world | This app contains two example custom REST handlers, hello_templates.py (EAI handler) and hello_world.py (script).  |

## See also

* [Extend the Splunk platform REST API with custom endpoints](https://dev.splunk.com/enterprise/docs/devtools/customrestendpoints) in the Splunk *Developer Guide*