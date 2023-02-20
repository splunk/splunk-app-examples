# Overview

This is an example Splunk App to demonstrate how to use setup pages that adhere to Splunk Application Certification standards.

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

*Note:* You can also copy files using `docker cp ./setup_pages/react_setup_page_example CONTAINER:/opt/splunk/etc/apps/react_setup_page_example`

# Configuration
Follow these steps to run through the react_setup_page example:

- Navigate to the react_setup_page and attempt to configure.

- This will show us simple form asking for multiple fields. Enter any data in all fields and click on `Submit` button.

- Set up configuration should complete successfully.

- To confirm this, navigate to the applications' root directory. The `local` directory will contain the `app.conf` and `macros.conf` files. `macros.conf` will contain the data provided in the setup page.

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
