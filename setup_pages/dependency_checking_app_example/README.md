# Overview

This is an example Splunk App that demonstrates how to use a setup page to check for the installation of app dependencies. This example adheres to Splunk Application Certification standards.

This app requires that users configure the weather app as a dependency in order to complete the setup process. The setup page checks whether the dependent app is configured and updated to a specific version before allowing users to access the app home page.

# Setup Page Entry Point

Splunk will automatically try to redirect the user to the setup page if the `app.conf`'s `[install]` stanza has its `is_configured` property set to false.

# Program Flow

This program starts in the `app.conf`, where the `[install]` stanza's `is_configured` property is set to `false`. This causes Splunk to redirect to it's setup page that is specified so that an admin/user can configure it for use.

In the `app.conf`'s, `[ui]` stanza there is a `setup_page` property that points to which resource should be used for the setup page. In this case it's pointing to `default/data/ui/views/setup_page_dashboard.xml`.

The dashboard view specifies its CSS and JavaScript resources and points to the two files in `appserver/static/javascript/app.js`(this will be generated after the build command specified in the installation steps below) and `appserver/static/styles/setup_page.css`.

And finally the `app.js` imports a React app inside dashboard view.

# Installation
- First users have to install dependencies by running `npm install` command in the root directory of the application.

- Then, inside `src` directory, user can write their own code.

- Run `npm run build` command. It will bundle all the files of the `src` directory and will save the whole bundle in `appserver/static/javascript` as `app.js`.

- Now run the `splunk-app-examples` docker container.

*Note:* You can also copy files using `docker cp ./setup_pages/dependency_checking_app_example CONTAINER:/opt/splunk/etc/apps/dependency_checking_app_example`

# Configuration
There are two apps installed out-of-the-box when you `make` examples repo. Both not configured to begin with. Follow these steps to run through the dependency_checking_setup_page_app example:

- Navigate to the dependency_checking_app and attempt to configure.

- There will be an alert that the `Weather_app_example` is not configured.

- Navigate to the `weather_app_example` and finish the configuration. Ensure the version installed is greater or equal to 1.0.

- Navigate back to the dependency_checking_app and attempt to configure.

- Set up configuration should complete successfully.

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
