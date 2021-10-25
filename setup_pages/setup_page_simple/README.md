# Overview

This is an example Splunk App to demonstrate how to use setup pages to store an encrypted credential with the storage/passwords endpoint using the Splunk SDK for Javascript.

# Setup Page Entry Point

Splunk will automatically try to redirect the user to the setup page if the `app.conf`'s `[install]` stanza has its `is_configured` property set to `0` (false).

# Program Flow

This program starts in the `app.conf`, where the `[install]` stanza's `is_configured` property is set to `0` (false). This causes Splunk to redirect to its setup page that is specified so that an admin/user can configure it for use.

In the `app.conf`'s, `[ui]` stanza there is a `setup_page` property that points to which resource should be used for the setup page. In this case it's pointing to `default/data/ui/views/setup_page_dashboard.xml`.

The dashboard view specifies its CSS and JavaScript resources and points to the two file in `appserver/static/javascript/setup_page.js` and `appserver/static/styles/setup_page.css`.

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
