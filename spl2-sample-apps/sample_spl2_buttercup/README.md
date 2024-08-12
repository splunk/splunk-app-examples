---
title: "README - sample SPL2 buttercup games"
---

## Overview

The `sample SPL2 buttercup games` app is a basic SPL2-based app that shows how to:

* Organize your app modules for customization and reuse.
* Specify a custom eval function.
* Specify the $SPLUNK_HOME path as a variable.
* Use a dataset literal to provide sample data for the app.
* Import an index, a lookup, and a function into the _default module.
* Use a base search to branch child searches.
* Export views.

## Compatibility, prerequisites, and requirements

This app is compatible with Splunk Enterprise.

You need a pre-release version of Splunk Enterprise that supports SPL2-based applications. See [SPL2 Public Beta overview](https://dev.splunk.com/enterprise/docs/developapps/createspl2apps/spl2previewoverview) for information about the Beta.

## Accessing the sample app

The app is available in the [spl2-sample-apps](https://github.com/splunk/splunk-app-examples/tree/master/spl2-sample-apps/sample_spl2_buttercup) folder on the Splunk GitHub Examples repository.

The app is uncompressed so that you can view the app folder structure, the modules, and other resources that are included with the app.

<!--## Installation

Complete the following steps to install a SPL2-based application:

1. On the pre-release version of Splunk Enterprise, install the `sample_spl2_buttercup_games.spl` app.
    1. Save the app on your pre-release version of Splunk Enterprise.
    2. On the Splunk Web home screen, select the **Apps** drop-down and then select **Manage apps**.
    3. Select the **Install app from file** button.
    4. Locate the app file and select **Upload**. You might be prompted to restart the Splunk Enterprise instance.

2. Verify that the app appears in the **Apps** drop-down. You can also find the app on your pre-release instance in the `$SPLUNK_HOME/etc/apps/<app_name>`folder.
-->

## App information

This app was developed by Splunk.

### App components

| App component  | Name                      | Description            |
| :------------- | :------------------------ | :--------------------------------- |
| App file name   | sample_spl2_buttercup_games.spl | |
| Namespace  | apps.sample_spl2_buttercup |  |
| Module    | _default | This module contains all of the searches for this app. |
| Module    | setup | This module contains the `get_metrics` function which includes a variable to specify the $SPLUNK_HOME path. | 
| Module    | functions | This module contains the custom eval function `prodnames`, which generates a string with the product ID and product name. |
| Module    | sample_data | This module contains a dataset literal of a sample set of events. |
| View  | $successful_purchases | This view returns specific fields from the dataset literal `$data`.  The results are shown in a table in the "Buttercup Games" dashboard.  |
| View  | $products  | This view uses a lookup and returns the product names that correspond to the product IDs. For the dataset, this view uses the `successful purchases` view as a base search The `$products` view was extended in the Search Bar in Splunk Web to create the pie chart in the "Buttercup Games" dashboard.  |
| View  | $error_count | This view generates a single value count of the errors in an index and with a specific sourcetype. The results of this view are shown in the single value visualization in the "Buttercup Games" dashboard. |
| View  | $names | This view uses a custom eval function called `prodnames`. The results of this view are show in the "Products Sold" report. |
| View  | $metrics | This view uses a command function to specify $SPLUNK_HOME variable and search an internal index. The view returns specific fields from the `_internal` index. The results are shown in a table in the "Buttercup Games" dashboard.|
| Function | prodnames | This function generates a string that identifies the ID and name for each product. The function is given an alias name, prodnames_func, in the _default module. This function is in the `functions` module.|
| Function | get_metrics | This function specifies a variable for $SPLUNK_HOME and returns events from the internal `metric.log` file. The function is given an alias name, get_metrics_func, in the _default module. This function is in the `setup` module.|
| Lookup    | sample_products.csv | This lookup is used in the _default module in a view called `$products`. |
| Lookup    | sample_suppliers.csv | You can use the `sample_suppliers.csv` lookup to extend the $products view. |
| Dashboard | Buttercup Games | This dashboard contains 4 visualizations:

* A pie chart showing the products sold.
* A table listing the successful purchases.
* A single value that displays the number of errors from sourcetype = splunkd_access.
* A table showing event messages from the `metrics.log` file. |
| Report    | Products Sold | This report uses the `sample_products` lookup to display the product names of the products sold.|

## App customizations

The `get_metrics` function in the `setup` module specifies a variable for $SPLUNK_HOME and returns events from the internal "metric.log" file. This function is used in the `$metrics` view.

This function defines $SPLUNK_HOME as `$splunk_home="/Applications/SplunkBeta"`.

If necessary, change the "$splunk_home" value in the `setup` module to match your operating system. See [Manage SPL2-based apps](https://docs.splunk.com/Documentation/Splunk/Admin/ManageSPL2apps#Manage_SPL2-based_apps) in the Splunk Enterprise *Admin Manual*.

## How to use the views in Splunk Web

You can run the views in this app in the Search Bar in Splunk Web using a specific syntax for SPL2.
The syntax is:

```| @spl2 from <view_name>```

For example:

```| @spl2 from successful_purchases```

You can refine the results from a view by extending the search.

For example, this search takes the exported view `successful_purchases` and extends the search by adding the `stats` command:

```| @spl2 from successful_purchases | stats count() BY categoryId```

For example, this search takes the exported view `products` and extends the search by adding the `buttercup_suppliers_lookup` to display the company name of the product supplier:

```| @spl2 from products | lookup buttercup_suppliers_lookup supplierId AS supplierID OUTPUTNEW supplier_name```

## Support

You can use the `#spl2` slack channel in the [splunk-usergroups Slack workspace](https://app.slack.com/client/T047WPASC/C06NKCFGP5J) to post any questions or comments about this app.

Alternatively, you can email us at `spl2@splunk.com`.

## Documentation

Splunk Developer Guide - [Create SPL2-based apps](https://dev.splunk.com/enterprise/docs/developapps/createspl2apps)
