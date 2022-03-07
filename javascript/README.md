# SDK examples

The Splunk App examples contains several server- and client-based examples.
For details, see this [examples](https://dev.splunk.com/enterprise/docs/devtools/javascript/sdk-javascript/sdkjavascriptexamples) on the Splunk Developer Portal.

## Setup
### Create a .splunkrc convenience file

To connect to Splunk Enterprise, many of the SDK examples and unit tests take command-line arguments that specify values for the host, port, and login credentials for Splunk Enterprise. For convenience during development, you can store these arguments as key-value pairs in a text file named **.splunkrc**. Then, the SDK examples and unit tests use the values from the **.splunkrc** file when you don't specify them.

>**Note**: Storing login credentials in the **.splunkrc** file is only for convenience during development. This file isn't part of the Splunk platform and shouldn't be used for storing user credentials for production. And, if you're at all concerned about the security of your credentials, enter them at the command line rather than saving them in this file.

To use this convenience file, create a text file with the following format:

    # Splunk Enterprise host (default: localhost)
    host=localhost
    # Splunk Enterprise admin port (default: 8089)
    port=8089
    # Splunk Enterprise username
    username=admin
    # Splunk Enterprise password
    password=changed!
    # Access scheme (default: https)
    scheme=https
    # Your version of Splunk Enterprise
    version=8.2

Save the file as **.splunkrc** in the current user's home directory.

*   For example on OS X, save the file as:

        ~/.splunkrc

*   On Windows, save the file as:

        C:\Users\currentusername\.splunkrc

    You might get errors in Windows when you try to name the file because ".splunkrc" appears to be a nameless file with an extension. You can use the command line to create this file by going to the **C:\Users\\&lt;currentusername&gt;** directory and entering the following command:

        Notepad.exe .splunkrc

    Click **Yes**, then continue creating the file.


### Configure NPM

Set the `SPLUNK_HOME` environment variable to the root directory of your Splunk instance.
* Navigate to directory splunk-app-examples/javascript
* Run `npm install`.

## Client-side examples

The Splunk Enterprise SDK for JavaScript includes several browser-based examples, which you can run from the Examples web page.

To start a simple web server and open the Examples page in a web browser, enter following command from **/splunk-app-examples/javascript** directory:

    npm run browser-examples

## Node.js examples

The Splunk App Examples includes several command-line examples, which are located in the **/splunk-app-examples/javascript/node** directory.
These examples can be executed individually or all together.

For example, to run all examples in single execution, open a command prompt/shell in the **/splunk-app-examples/javascript/** directory and enter:
    
    npm test

To execute individual example such as **jobs.js** file, open a command prompt/shell in the **/splunk-app-examples/javascript/node** directory and enter:

    node jobs.js list

If you aren't storing your login credentials in **.splunkrc**, enter the following command, providing your own values:

    node jobs.js --username yourusername --password yourpassword list

Your output should look something like this:

    ~\splunk-app-examples\examples\node> node .\jobs.js list
      Job 1 sid: scheduler__nobody__search_VG9wIGZpdmUgc291cmNldHlwZXM_at_1323917700_79740ae7e22350d6
      Job 2 sid: scheduler__nobody__search_VG9wIGZpdmUgc291cmNldHlwZXM_at_1323917400_0dceb302931a2b3f
      Job 3 sid: scheduler__nobody__search_SW5kZXhpbmcgd29ya2xvYWQ_at_1323917100_48fb4cc65a25c5b1
      Job 4 sid: scheduler__nobody__search_SW5kZXhpbmcgd29ya2xvYWQ_at_1323916200_b2f239fef7834523
      Job 5 sid: scheduler__nobody__unix_QWxlcnQgLSBzeXNsb2cgZXJyb3JzIGxhc3QgaG91cg_at_1323914400_96cb9084680b25d7
      Job 6 sid: admin__admin__search_TXkgQXdlc29tZSBTYXZlZCBTZWFyY2g_1323901055.6
    ==============


