# Overview of modular inputs

A modular input is a Splunk app that defines a custom input capability. Because modular inputs are treated as native inputs, system administrators and end users can select and configure them like any other input in the Splunk platform.

Modular inputs contain a script to stream the data from the data source to the Splunk platform. When users install this app in their Splunk platform deployment, the modular input is treated as a native data input that is listed in the **Settings** > **Data inputs** page in Splunk Web. The modular input app can include a setup UI for users to configure the input, provide runtime controls, and allow the input to specify per-event index-time settings. The result is that users can select and configure a modular input like any other data input in the Splunk platform.

## Why create a modular input?

Modular inputs are ideal for packaging and sharing technology-specific data sources. Modular inputs enable users to interact with key information using the familiar Splunk Manager interface, without needing to edit configuration files. Modular inputs also provide runtime controls and allow the input to specify per-event index-time settings.

## Workflow for creating a modular input

Follow this workflow to create a modular input.

1. Create a modular input script.
2. Create an input configuration specification.

## Modular input examples

This repository contains the following examples to help you get started creating modular inputs.

| Example        | Description                                                                                                                                         |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| github_commits | Contains a modular input that pulls commit data from GitHub and creates an event for each commit                                                    |
| github_forks   | Contains a modular input that uses the GitHub API to generate the number of repository forks based on the owner and repo_name provided during setup |
| random_numbers | Contains a modular input that generates a random number based on a range provided during setup                                                      |

## See also

* [Overview of modular inputs for Splunk Cloud Platform or Splunk Enterprise](https://dev.splunk.com/enterprise/docs/developapps/manageknowledge/custominputs/modinputsoverview) in the Splunk *Developer Guide*