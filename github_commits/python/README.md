splunk-sdk-python github_commits example
========================================

This app provides an example of a modular input that Pulls down commit data from GitHub and creates events for each commit. 

which are then streamed to Splunk, based on the owner and repo_name provided by the user during setup of the input. <br /> <br />

To run this example locally, execute the following command from the root of this repository.
```shell
SPLUNK_VERSION=latest docker compose up -d
```
<br />

Check the container health, run:
```shell
docker ps
```
Make sure STATUS is **healthy** for **splunk-app-examples** container<br /> <br/>


Copy the **github_commits** folder in **etc/apps** inside the container. <br />
Execute the following command from the root of this directory.
```shell
docker cp github_commits/python splunk-app-examples:/opt/splunk/etc/apps/github_commits
```
<br />

Install splunklib in github_commits/lib folder. Run: <br /> 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/github_commits/lib
```
<br />

Restart the container. Run:
```shell
docker stop splunk-app-examples
docker start splunk-app-examples
```