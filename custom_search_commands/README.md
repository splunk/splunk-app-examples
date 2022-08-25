# Overview of custom search commands

Custom search commands are user-defined Splunk Search Processing Language (SPL) commands implemented in Python scripts that extend SPL to serve your specific needs. Custom search commands let you perform additional data analysis in Splunk Cloud Platform or Splunk Enterprise. 

## Use cases for custom search commands

Here are some use cases for custom search commands.

* You want to process data in a way that Splunk software hasn't handled yet.
* You want to import data from an external source that is not indexed by Splunk software into your search pipeline.
* You want to export search results to an external system, such as JIRA.

## Workflow for creating a custom search command

Follow this workflow to create a custom search command.

1. Install the Splunk SDK for Python in your app.
2. Write the custom search command Python script.
3. Register the search command in your app configuration.
4. Enable search assistant text in your app configuration.

## Custom search command examples

This repository contains the following examples to help you get started creating custom search commands.

| Example                      | Description                                                               |
|------------------------------|---------------------------------------------------------------------------|
| customsearchcommands_app     | App containing multiple example custom search commands of different types |
| eventingsearchcommands_app   | App containing an example eventing custom search command                  |
| generatingsearchcommands_app | App containing an example generating custom search command                |
| reportingsearchcommands_app  | App containing an example reporting custom search command                 |
| streamingsearchcommands_app  | App containing an example streaming custom search command                 |

## See also

* [Create custom search commands for apps in Splunk Cloud Platform or Splunk Enterprise](https://dev.splunk.com/enterprise/docs/devtools/customsearchcommands) in the Splunk *Developer Guide*