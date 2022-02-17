# The Splunk Examples for Python SDK

The Splunk Examples for Python SDK contains examples that are designed to enable developers to analyse and run the various examples for python SDK.

The Splunk platform is a search engine and analytic environment that uses a distributed map-reduce architecture to efficiently index, search, and process large time-varying data sets.

The Splunk platform is popular with system administrators for aggregation and monitoring of IT machine data, security, compliance, and a wide variety of other scenarios that share a requirement to efficiently index, search, analyze, and generate real-time notifications from large volumes of time-series data.

The Splunk developer platform enables developers to take advantage of the same technology used by the Splunk platform to build exciting new applications.

## Getting started with the Splunk Examples for Python SDK

### Requirements

* Python 3.7
  
  The Splunk Enterprise SDK for Python has been tested with and v3.7.

* Splunk Enterprise

  If you haven't already installed Splunk Enterprise, download it [here](http://www.splunk.com/download). 
  For more information, see the Splunk Enterprise [_Installation Manual_](https://docs.splunk.com/Documentation/Splunk/latest/Installation).

### Install the SDK

Use the following commands to install the Splunk Enterprise SDK for Python libraries.

Use `pip`:

    [sudo] pip install splunk-sdk

## Testing Quickstart

You'll need `docker` and `docker-compose` to get up and running using this method.

```
make up SPLUNK_VERSION=8.0
make wait_up
make test
make down
```

The SDK command-line examples require a common set of arguments that specify the host, port, and login credentials for Splunk Enterprise. For a full list of command-line arguments, include `--help` as an argument to any of the examples.

###
#### Update a .env file

To connect to Splunk Enterprise, many of the SDK examples and unit tests take command-line arguments that specify values for the host, port, and login credentials for Splunk Enterprise. For convenience during development, you can store these arguments as key-value pairs in a **.env** file. Then, the SDK examples and unit tests use the values from the **.env** file when you don't specify them.

>**Note**: Storing login credentials in the **.env** file is only for convenience during development. This file isn't part of the Splunk platform and shouldn't be used for storing user credentials for production. And, if you're at all concerned about the security of your credentials, enter them at the command line rather than saving them in this file.

here is an example of .env file:

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
    version=8.0
    # Bearer token for authentication
    #bearerToken=<Bearer-token>
    # Session key for authentication
    #sessionKey=<Session-Key>

#### Run the examples

To run the examples at the command line, use the Python interpreter and include any arguments that are required by the example. In the commands below, replace "examplename" with the name of the specific example in the directory that you want to run:
```commandline 
cd python
```
Using username and Password
    
    python examplename.py --username="admin" --password="changeme"

Using Bearer token
    
    python examplename.py --bearerToken=<value>

Using Session key
    
    python examplename.py --sessionKey="<value>"

If you saved your login credentials in the **.env** file, you can omit those arguments:

    python examplename.py

To get help for an example, use the `--help` argument with an example:

    python examplename.py --help

#### Run the unit tests

The Splunk Enterprise SDK for Python contains a collection of unit tests. All the tests are within the **/tests**

To run the tests from the terminal, make sure you have **splunk-sdk** and **tox** installed.

```commandline
    cd python
    [sudo] pip install tox 
```

Once you have the tox installed. Open the terminal in **/python** directory and run:
```commandline
    tox -e py
```

>**Notes:**
>*  To learn about our testing framework, see [Splunk Test Suite](https://github.com/splunk/splunk-sdk-python/tree/master/tests) on GitHub.

## Repository

| Directory/File  | Description                                                |
|:----------------|:---------------------------------------------------------- |
| python/tests    | Source for unit tests                                      |
| python/utils.py | Source for utilities shared by the examples and unit tests |


### Branches

The **master/python** branch represents a working set of the python examples.

## Documentation and resources

| Resource                | Description |
|:----------------------- |:----------- |
| [Splunk Developer Portal](http://dev.splunk.com) | General developer documentation, tools, and examples |
| [Integrate the Splunk platform using development tools for Python](https://dev.splunk.com/enterprise/docs/devtools/python)| Documentation for Python development |
| [Splunk Enterprise SDK for Python Reference](http://docs.splunk.com/Documentation/PythonSDK) | SDK API reference documentation |
| [REST API Reference Manual](https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTprolog) | Splunk REST API reference documentation |
| [Splunk>Docs](https://docs.splunk.com/Documentation) | General documentation for the Splunk platform |
| [GitHub Wiki](https://github.com/splunk/splunk-sdk-python/wiki/) | Documentation for this SDK's repository on GitHub |

### Contact Us

You can reach the Splunk Developer Platform team at _devinfo@splunk.com
