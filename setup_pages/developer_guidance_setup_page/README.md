# Overview

This is an example Splunk App to demonstrate how to use setup pages that adhere to Splunk Application Certification standards.

# Setup Page Entry Point

Splunk will automatically try to redirect the user to the setup page if the `app.conf`'s `[install]` stanza has its `is_configured` property set to false.

# Program Flow

This program starts in the `app.conf`, where the `[install]` stanza's `is_configured` property is set to `false`. This causes Splunk to redirect to it's setup page that is specified so that an admin/user can configure it for use.

In the `app.conf`'s, `[ui]` stanza there is a `setup_page` property that points to which resource should be used for the setup page. In this case it's pointing to `default/data/ui/views/setup_page_dashboard.xml`.

The dashboard view specifies its CSS and JavaScript resources and points to the two file in `appserver/static/javascript/setup_page.js` and `appserver/static/styles/setup_page.css`.

And finally the `setup_page.js` imports a custom Backbone view from the `appserver/static/javascript/views/setup_page_example.js`.

# Resources
- Splunk Techniques Used
    - Splunk Dashboards
        - [API Documentation](http://docs.splunk.com/Documentation/SplunkCloud/latest/Viz/PanelreferenceforSimplifiedXML) (docs.splunk.com)
    - Splunk Setup Page
        - [app.conf Specification](http://docs.splunk.com/Documentation/Splunk/6.6.3/admin/Appconf#.5Bui.5D)
    - Splunk Web Framework
        - [API Documentation](http://docs.splunk.com/Documentation/WebFramework) (docs.splunk.com)
        - [Main Website](http://dev.splunk.com/webframework) (dev.splunk.com)
- Technology Used
    - CSS
    - HTML
    - JavaScript
        - Backbone JS
            - [Main Website](http://backbonejs.org/)
            - [On GitHub](https://github.com/jashkenas/backbone/)
            - [Views are the only feature used](http://backbonejs.org/#View)
        - JQuery
            - [Main Website](http://jquery.com/)
            - [On GitHub](https://github.com/jquery/jquery/)
        - Splunk JavaScript Software Development Kit
            - [API Documentation](http://docs.splunk.com/Documentation/JavaScriptSDK) (docs.splunk.com)
            - [On GitHub](https://github.com/splunk/splunk-sdk-javascript)
            - [Main Website](http://dev.splunk.com/javascript) (dev.splunk.com)
