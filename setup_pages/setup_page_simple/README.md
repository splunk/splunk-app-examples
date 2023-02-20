# Overview

This is an example Splunk App to demonstrate how to use setup pages to store an encrypted credential with the storage/passwords endpoint using the Splunk SDK for Javascript.

# Setup Page Entry Point

Splunk will automatically try to redirect the user to the setup page if the `app.conf`'s `[install]` stanza has its `is_configured` property set to `0` (false).

# Program Flow

This program starts in the `app.conf`, where the `[install]` stanza's `is_configured` property is set to `0` (false). This causes Splunk to redirect to its setup page that is specified so that an admin/user can configure it for use.

In the `app.conf`'s, `[ui]` stanza there is a `setup_page` property that points to which resource should be used for the setup page. In this case it's pointing to `default/data/ui/views/setup_page_dashboard.xml`.

The dashboard view specifies its CSS and JavaScript resources and points to the two files in `appserver/static/javascript/app.js`(this will be generated after the build command specified in the installation steps below) and `appserver/static/styles/setup_page.css`.

# Installation
- First users have to install dependencies by running `npm install` command in the root directory of the application.

- Then, inside `src` directory, user can write their own code.

- Run `npm run build` command. It will bundle all the files of the `src` directory and will save the whole bundle in `appserver/static/javascript` as `app.js`.

- Now run the `splunk-app-examples` docker container.

*Note:* You can also copy files using `docker cp ./setup_pages/setup_page_simple CONTAINER:/opt/splunk/etc/apps/setup_page_simple`

# Configuration
Follow these steps to run through the setup_page_simple example:

- Navigate to the setup_page_simple and attempt to configure.

- This will show us simple form asking for the password. Enter any password and click on `Complete Setup` button.

- Set up configuration should complete successfully.

- To confirm this, navigate to the applications' root directory. The `local` directory will contain the `app.conf` and `passwords.conf` files. `passwords.conf` file will contain the password (in encoded form) provided in the setup page.

# Resources
- Splunk Techniques Used
    - Splunk Dashboards
        - [API Documentation](https://docs.splunk.com/Documentation/SplunkCloud/latest/Viz/PanelreferenceforSimplifiedXML) (docs.splunk.com)
    - Splunk Setup Page
        - [app.conf Specification](https://docs.splunk.com/Documentation/Splunk/latest/admin/Appconf#.5Bui.5D)
    - Splunk Web Framework
        - [API Documentation](https://docs.splunk.com/Documentation/WebFramework) (docs.splunk.com)
        - [Main Website](https://dev.splunk.com/webframework) (dev.splunk.com)
- Technology Used
    - CSS
    - HTML
    - JavaScript
        - JQuery
            - [Main Website](https://jquery.com/)
            - [On GitHub](https://github.com/jquery/jquery/)
        - Splunk JavaScript Software Development Kit
            - [API Documentation](https://docs.splunk.com/Documentation/JavaScriptSDK) (docs.splunk.com)
            - [On GitHub](https://github.com/splunk/splunk-sdk-javascript)
            - [Main Website](https://dev.splunk.com/enterprise/docs/devtools/javascript/sdk-javascript) (dev.splunk.com)
