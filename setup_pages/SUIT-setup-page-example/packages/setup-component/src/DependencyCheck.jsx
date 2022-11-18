import React, { useState, useEffect } from 'react';
import Button from '@splunk/react-ui/Button';
import Heading from '@splunk/react-ui/Heading';
import List from '@splunk/react-ui/List';
import Link from '@splunk/react-ui/Link';
import { defaultFetchInit, handleError, handleResponse } from '@splunk/splunk-utils/fetch';
// import { defaultFetchInit, handleResponse, handleError } from '@splunk/splunk-utils/fetch';

const appsEndpoint = '/en-US/splunkd/__raw/servicesNS/nobody/system/apps/local/'; // this is the endpoint that will get us in the apps list

async function getApps() {
    // this function will fetch a list of apps from the apps endpoint

    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'GET';
    const n = await fetch(`${appsEndpoint}?output_mode=json&count=100`, {
        ...fetchInit,
    }).then(handleResponse(200));

    return n;
}

async function updateAppConf() {
    // function to update app.conf is_configured property to true when password is successfully added

    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'POST';
    const n = await fetch(`${appsEndpoint}/setup-example-app`, {
        ...fetchInit,
        body: 'configured=true', // update the configured property
    });

    return n;
}

const DependencyCheck = () => {
    // create state variables using state hooks
    const [appsList, setAppsList] = useState([]);

    // the app we want to check against
    const dependency = 'search';

    useEffect(() => {
        // get our app data from the getApps function after rendering for the first time
        getApps().then((r) => {
            const list = r.entry.map((entry) => entry.name);
            setAppsList(list);
        });
    }, []); // useEffect only runs once due to the empty array

    const checkDependency = () => {
        // this function checks whether or not our dependency is in our apps list, if so then update app.conf to complete setup and reload the app
        if (appsList.includes(dependency)) {
            updateAppConf().then((r) => {
                // update app.conf
                if (r.status >= 200 && r.status <= 299) {
                    // if app.conf is successfully updated, then reload the page
                    window.location.href = '/en-US/app/setup-example-app/search';
                }
            });
        } else {
            console.log('error');
        }
    };

    return (
        // create the UI for the Setup Page
        <>
            <div>
                <div>
                    <Heading level={1}>Welcome to Your Setup Page!</Heading>

                    <div className="left">
                        <Heading level={2}>Dependency Check</Heading>
                        Your app may require that another app is installed on the deployment so that
                        it can function as expected. An app can check whether or not another app is
                        installed, and then prompt the user accordingly. This can be done by
                        following a setup workflow similar to what might be done when requiring a
                        password or an API key from the user.
                        <br />
                        <br />
                        This page of the <b>Setup Example App</b> will run a dependency check for
                        the <b>Search and Reporting</b> app, so it should always pass. The app
                        itself also shows a more traditional setup flow for secret storage as well.
                        Check out the{' '}
                        <Link to="https://github.com/splunk/SUIT-setup-page-example/tree/main">
                            GitHub
                        </Link>{' '}
                        to learn how to switch between the pages to explore the examples, or to test
                        this example with different app dependencies. You can use the code provided
                        in the GitHub to help build setup pages in your apps.
                        <br />
                        <br />
                        You can check a detailed explanation of this workflow in{' '}
                        <Link to="https://dev.splunk.com/enterprise/docs/developapps/manageknowledge/setuppage/checkappdependencies">
                            docs.
                        </Link>{' '}
                        However, in this app we implement the process using the Splunk UI Toolkit.
                        Here is a list of the packages we use to build this app.
                        <List>
                            <List.Item>
                                <Link to="https://splunkui.splunk.com/Create/ComponentTutorial">
                                    @splunk/create
                                </Link>
                                <List style={{ margin: 0 }}>
                                    <List.Item>
                                        Generates the entire Splunk App, allowing for easy creation
                                        of a cloud ready Splunk App with ReactJS
                                    </List.Item>
                                </List>
                            </List.Item>
                            <List.Item>
                                <Link to="https://splunkui.splunk.com/Packages/react-ui">
                                    @splunk/react-ui
                                </Link>
                                <List style={{ margin: 0 }}>
                                    <List.Item>
                                        Visual component library to easily put together consistent
                                        and responsive user interfaces. Used in the password entry,
                                        buttons and page layout of the app
                                    </List.Item>
                                </List>
                            </List.Item>
                            <List.Item>
                                <Link to="https://splunkui.splunk.com/Packages/splunk-utils">
                                    @splunk/splunk-utils
                                </Link>
                                <List style={{ margin: 0 }}>
                                    <List.Item>
                                        Allows for interaction with Splunk REST API endpoints. Used
                                        to update specified conf files and generate helper functions
                                        for the workflow of the setup page
                                    </List.Item>
                                </List>
                            </List.Item>
                        </List>
                        <br />
                        <Heading level={2}>Check App Dependency</Heading>
                        <div>
                            Please press the &quot;Perform Setup&quot; button below to complete the
                            Splunk App setup, this will check the required app dependency, and if
                            successful, will take you to the rest of the app.
                        </div>
                        <br />
                        <div>
                            <Button
                                type="submit"
                                label="Perform Setup"
                                name="setup_button"
                                onClick={checkDependency} // complete setup by running the password click function
                            />
                        </div>
                        <br />
                        <div className="error output" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DependencyCheck;
