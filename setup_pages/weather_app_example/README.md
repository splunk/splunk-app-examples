# Overview

This is an example Splunk App to demonstrate how to use setup pages that adhere to Splunk Application Certification standards.

# Setup Page Entry Point

Splunk will automatically try to redirect the user to the setup page if the `app.conf`'s `[install]` stanza has its `is_configured` property set to false.

# Program Flow

This program starts in the `app.conf`, where the `[install]` stanza's `is_configured` property is set to `false`. This causes Splunk to redirect to it's setup page that is specified so that an admin/user can configure it for use.

In the `app.conf`'s, `[ui]` stanza there is a `setup_page` property that points to which resource should be used for the setup page. In this case it's pointing to `default/data/ui/views/setup_page_dashboard.xml`.

The dashboard view specifies its and JavaScript source code and points to `views/setup_page.js`.

And finally the `setup_page.js` imports a React app from `src/views/app.js`.


# Installation
- First users have to install dependencies by running `npm install` command in the root directory of the application.

- Then, inside `src` directory, user can write their own code.

- Run `npm run build command`. It will bundle all the files in `src` directory and will save the whole bundle in `appserver/static/javascript` as `app.js`.

- Now run the `splunk-app-examples` docker container.


*Note:* You can also copy files using `docker cp ./setup_pages/weather_app_example CONTAINER:/opt/splunk/etc/apps/weather_app_example`

# Resources
- Splunk Techniques Used
    - Splunk Dashboards
        - [API Documentation](http://docs.splunk.com/Documentation/SplunkCloud/latest/Viz/PanelreferenceforSimplifiedXML) (docs.splunk.com)
    - Splunk Setup Page
        - [app.conf Specification](http://docs.splunk.com/Documentation/Splunk/6.6.3/admin/Appconf#.5Bui.5D)
    - Splunk Web Framework
        - [Main Website](https://dev.splunk.com/enterprise/docs/developapps/webframework) (dev.splunk.com)
- Technology Used
    - CSS
    - HTML
    - JavaScript
        - React
            - [Main Website](https://reactjs.org/)
            - [On GitHub](https://github.com/facebook/react)
        - Splunk JavaScript Software Development Kit
            - [Main Website](https://dev.splunk.com/enterprise/docs/javascript/sdk-javascript) (dev.splunk.com)
            - [On GitHub](https://github.com/splunk/splunk-sdk-javascript)
        - Browserify
            - [Main Website](https://browserify.org/)
            - [On GitHub](https://github.com/browserify/browserify)
