---
title: "README - sample SPL2 pii masking"
---

## Overview

The `sample SPL2 pii masking` app is an SPL2-based app that you can use to:
* Learn about permissions on modules.
* Learn how to architect your modules to create a masked view on a dataset that users would not otherwise have access to.
* Enable a role to run the views in a module as if the role is the owner of the module.

For more information see [Understand app permission limitations](https://dev.splunk.com/enterprise/docs/developapps/createspl2apps/prepspl2modules#Understand-app-permission-limitations).

In addition, this app shows how to:

* Organize your app modules for customization and reuse.
* Use a separate module that contains views for specific user roles and capabilities. You can mask sensitive employee ID data in an index for most users, while keeping that data unmasked for privileged roles.
* How to specify a custom command function to masking out sensitive data.
* Use a dataset literal to provide sample data for the app.
* Import a view into your _default module.
* Export views.

## Compatibility, prerequisites, and requirements

This app is compatible with Splunk Enterprise.

You need a pre-release version of Splunk Enterprise that supports SPL2-based applications. See [SPL2 Public Beta overview](https://dev.splunk.com/enterprise/docs/developapps/createspl2apps/spl2previewoverview) for information about the Beta.

## Installation

Complete the following steps to install a SPL2-based application:

1. On the pre-release version of Splunk Enterprise, install the `sample_spl2_pii_masking.spl` app.
    1. Save the app on your pre-release version of Splunk Enterprise.
    2. On the Splunk Web home screen, select the **Apps** drop-down and then select **Manage apps**.
    3. Select the **Install app from file** button.
    4. Locate the app file and select **Upload**. You might be prompted to restart the Splunk Enterprise instance.

2. Verify that the app appears in the **Apps** drop-down. You can also find the app on your pre-release instance in the `$SPLUNK_HOME/etc/apps/<app_name>`folder.

## App information

This app was developed by Splunk.

### App components

| App component  | Name                      | Description            |
| :------------- | :------------------------ | :--------------------------------- |
| App file name   | sample_spl2_pii_masking.spl | |
| Namespace  | apps.sample_spl2_pii_masking |  |
| Module    | _default | This module contains all of the searches for this app. |
| Module    | functions | This module contains the custom command function `pii_mask`, which masks sensitive employee ID data in a dataset.
| Module    | sample_data | This module contains a dataset literal of a sample set of events. |
| View  | $masked_view | This view returns all of the events with masked email addresses. 
This view is used to create the 'Failed logins (masked)' report. |
| View  | $failed_logins_unmasked | This view returns the failed login events from a dataset literal. No data is masked. |
| View  | $failed_logins_masked | This view returns the failed login events from a dataset literal. Email addresses are masked. |
| Function | pii_mask | This command function masks the values in the `UserKey` field. |
| Report    | Failed logins | This report shows the failed login events from a dataset literal. No data is masked. |
| Report    | Failed logins (masked) | This report shows the failed login events from a dataset literal. Email addresses are masked. |

## App customizations

In this Beta, people with the `user` role do not have permission to run SPL2 searches using the views in an app. However, the Splunk administrator can set role-based permissions after the app is installed.

For example, a Splunk administrator can use the REST API endpoints to set 'execute' permissions on the `masking` module for the `user` role. This enables people with that role to perform searches using the `masked_view` that is in the `masking` module.

## How to use the views in Splunk Web

You can run the views in this app in the Search Bar in Splunk Web using a specific syntax for SPL2.
The syntax is:

```| @spl2 from <view_name>```

For example:

```| @spl2 from masked_view```

This view masks the email addresses in the UserKey field.

There are 2 views in this app that show the failed logins, one view shows the unmasked values and the other shows the masked values. You can compare the differences between the masked and unmasked results by either running the views or opening the Reports.

For example, this search runs the exported view `failed_logins_unmasked`:

```| @spl2 from failed_logins_unmasked```

For example, this search runs the exported view `failed_logins_masked`:

```| @spl2 from failed_logins_masked```

## Support

You can use the `#spl2` slack channel in the [splunk-usergroups Slack workspace](https://app.slack.com/client/T047WPASC/C06NKCFGP5J) to post any questions or comments about this app.

Alternatively, you can email us at `spl2@splunk.com`.

## Documentation

Splunk Developer Guide - [Create SPL2-based apps](https://dev.splunk.com/enterprise/docs/developapps/createspl2apps)

Happy Splunking!