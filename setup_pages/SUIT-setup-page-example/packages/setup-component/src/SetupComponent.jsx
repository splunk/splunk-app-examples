import React, { useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Heading from '@splunk/react-ui/Heading';
import List from '@splunk/react-ui/List';
import Link from '@splunk/react-ui/Link';
import Text from '@splunk/react-ui/Text';
import ColumnLayout from '@splunk/react-ui/ColumnLayout';
import { defaultFetchInit, handleResponse } from '@splunk/splunk-utils/fetch';
// import { defaultFetchInit, handleResponse, handleError } from '@splunk/splunk-utils/fetch';

const passwordsEndpoint =
    '/en-US/splunkd/__raw/servicesNS/nobody/setup-example-app/storage/passwords';

async function updateAppConf() {
    // function to update app.conf is_configured property to true when password is successfully added

    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'POST';
    const n = await fetch(
        '/en-US/splunkd/__raw/servicesNS/nobody/system/apps/local/setup-example-app',

        {
            ...fetchInit,
            body: 'configured=true', // update the configured property
        }
    );

    return n;
}

// async function getPasswords() {
//     // this function can be used to retrieve passwords if that becomes necessary in your app
//     const fetchInit = defaultFetchInit; // from splunk-utils API
//     fetchInit.method = 'GET';
//     const n = await fetch(`${passwordsEndpoint}?output_mode=json`, {
//         ...fetchInit,
//     }).then(handleResponse(200));

//     return n;
// }

/* Function to create a Password */
async function createPassword(password) {
    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'POST';
    const realm = 'testRealm';
    const user = 'user';

    const n = await fetch(`${passwordsEndpoint}`, {
        ...fetchInit,
        body: `name=${user}&password=${password}&realm=${realm}`, // put password into passwords.conf
    });

    return n;
}

const SetupComponent = () => {
    // create state variables using state hooks

    const [password, setPassword] = useState();
    const [isValid, setValid] = useState(false);

    const passwordClick = () => {
        if (isValid) {
            createPassword(password).then((response) => {
                if (response.status >= 200 && response.status <= 299) {
                    // check if password was successfully stored
                    updateAppConf().then((r) => {
                        // update app.conf
                        if (r.status >= 200 && r.status <= 299) {
                            // if app.conf is successfully updated, then reload the page
                            window.location.href = 'en-US/app/setup-example-app/search';
                        }
                    });
                } else {
                    console.log('error');
                }
            });
        }
    };

    const handleUserInput = (event) => {
        // add password input error handling here
        if (event.target.value.length > 5) {
            setValid(true);
        } else {
            setValid(false);
        }
    };

    return (
        // create the UI for the Setup Page
        <>
            <div>
                <div>
                    <Heading level={1}>Welcome to Your Setup Page!</Heading>
                    <ColumnLayout divider="vertical">
                        <ColumnLayout.Row>
                            <ColumnLayout.Column span={6}>
                                <div className="left">
                                    <Heading level={2}>Overview</Heading>
                                    In many cases, a Splunk app requires additional configuration so
                                    that it can perform the functionality it was designed for. This
                                    can include: saving user-provided configuratiions in .conf
                                    files, integrating with external services through REST API and
                                    checking for app dependencies. You can check out the app
                                    dependency example for this app by visiting the project&apos;s{' '}
                                    <Link to="https://github.com/splunk/SUIT-setup-page-example/tree/main">
                                        GitHub
                                    </Link>{' '}
                                    page.
                                    <br />
                                    <br />
                                    This setup page is a small example of the many different use
                                    cases, and it will create/modify two files in the local
                                    directory of this Splunk App.
                                    <br />
                                    <br />
                                    <b>Splunk App Directory Path:</b>{' '}
                                    $SPLUNK_HOME/etc/apps/setup-example-app/local/
                                    <List>
                                        <List.Item>
                                            <Link to="https://docs.splunk.com/Documentation/Splunk/latest/Admin/Appconf">
                                                app.conf
                                            </Link>
                                            <List style={{ margin: 0 }}>
                                                <List.Item>
                                                    Sets the [install] stanza <b>is_configured</b>{' '}
                                                    property to <b>true</b>
                                                </List.Item>
                                            </List>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="https://docs.splunk.com/Documentation/Splunk/latest/Admin/Passwords">
                                                passwords.conf
                                            </Link>
                                            <List style={{ margin: 0 }}>
                                                <List.Item>
                                                    Creates and encrypts the password, resulting in
                                                    a new passwords.conf stanza.
                                                </List.Item>
                                            </List>
                                        </List.Item>
                                    </List>
                                    In some cases, you can even introduce custom setup options and
                                    parameters, which would require an additional file. For example,
                                    if you wanted the user to specify a custom configuration.
                                    <List>
                                        <List.Item>
                                            custom_setup.conf
                                            <List style={{ margin: 0 }}>
                                                <List.Item>
                                                    Creates a custom conf file to manage Splunk App
                                                    specific settings
                                                </List.Item>
                                                <List.Item>
                                                    Creates the stanza [example_stanza]
                                                </List.Item>
                                            </List>
                                        </List.Item>
                                    </List>
                                    <Heading level={2}>Setup Properties</Heading>
                                    <div className="field api_key">
                                        <div className="title">
                                            <Heading level={3}>Password:</Heading>
                                            Please specify the password that will be used to setup
                                            this app.
                                        </div>
                                        <Text
                                            inline
                                            type="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value); // store the password that the user inputs into state
                                                handleUserInput(e);
                                            }}
                                        />{' '}
                                    </div>
                                    <Heading level={2}>Complete the Setup</Heading>
                                    <div>
                                        Please press the <b>Perform Setup</b> button below to
                                        complete the Splunk App setup.
                                    </div>
                                    <br />
                                    <div>
                                        <Button
                                            type="submit"
                                            label="Perform Setup"
                                            name="setup_button"
                                            onClick={passwordClick} // complete setup by running the password click function
                                        />
                                    </div>
                                    <br />
                                    <div className="error output" />
                                </div>
                            </ColumnLayout.Column>
                            <ColumnLayout.Column span={6}>
                                <div className="right">
                                    <Heading level={2}>Implementation Overview</Heading>
                                    Splunk setup pages can be made with various Splunk provided
                                    developer tools. This app utilizes the new{' '}
                                    <b>Splunk UI Toolkit</b>, allowing for consistent visual
                                    components and responsive app interaction with ReactJS packages.
                                    <br />
                                    <Heading level={2}>Packages</Heading>
                                    <List>
                                        <List.Item>
                                            <Link to="https://splunkui.splunk.com/Create/ComponentTutorial">
                                                @splunk/create
                                            </Link>
                                            <List style={{ margin: 0 }}>
                                                <List.Item>
                                                    Generates the entire Splunk App, allowing for
                                                    easy creation of a cloud-ready Splunk App with
                                                    ReactJS
                                                </List.Item>
                                            </List>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="https://splunkui.splunk.com/Packages/react-ui">
                                                @splunk/react-ui
                                            </Link>
                                            <List style={{ margin: 0 }}>
                                                <List.Item>
                                                    Visual component library to easily put together
                                                    consistent and responsive user interfaces. Used
                                                    in the password entry, buttons and page layout
                                                    of the app
                                                </List.Item>
                                            </List>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="https://splunkui.splunk.com/Packages/splunk-utils">
                                                @splunk/splunk-utils
                                            </Link>
                                            <List style={{ margin: 0 }}>
                                                <List.Item>
                                                    Allows for interaction with Splunk REST API
                                                    endpoints. Used to update specified conf files
                                                    and generate helper functions for the workflow
                                                    of the setup page
                                                </List.Item>
                                            </List>
                                        </List.Item>
                                    </List>
                                    <Heading level={2}>More Information</Heading>
                                    <List>
                                        <List.Item>
                                            <Link to="https://splunkui.splunk.com">
                                                Splunk UI Documentation
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="https://dev.splunk.com">
                                                Splunk Platform Developer Documentation
                                            </Link>
                                        </List.Item>
                                        <List.Item>
                                            <Link to="https://github.com/splunk/SUIT-setup-page-example/tree/main">
                                                GitHub Link for this app
                                            </Link>
                                        </List.Item>
                                    </List>
                                </div>
                            </ColumnLayout.Column>
                        </ColumnLayout.Row>
                    </ColumnLayout>
                </div>
            </div>
        </>
    );
};

export default SetupComponent;
