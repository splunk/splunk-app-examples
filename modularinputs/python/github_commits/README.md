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
docker cp modularinputs/python/github_commits splunk-app-examples:/opt/splunk/etc/apps/github_commits
```
<br />

Install splunklib in github_commits/lib folder. Run: <br /> 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/github_commits/lib
```
<br />

Restart the container. Run: </br>
From UI:
```markdown
Settings > Server controls > Restart Splunk
```

From Terminal:
```shell
docker stop splunk-app-examples
docker start splunk-app-examples
```

Once the Splunk is in healthy state, <br />

In Splunk UI, Go to **Settings > DATA > Data inputs** <br />

Search for **"Github Commits"** <br />

Click on the **+Add new** button in front of the **Github Commits** which open a configuration page for **Github Commits** app <br />

**name:** Name of your choice to refer this search later. No special characters. i.e. python <br />
**Owner:** Github user or organization that created the repository. i.e. Splunk <br />
**Repo Name:** Name of the Github repository. i.e. splunk-sdk-python <br />
**Token (optional):** A Github API access token. Required for private repositories (the token must have the 'repo' and 'public_repo' scopes enabled). Recommended to avoid Github's API limit, especially if setting an interval. <br />

Once the details are filled, click on **Next** and then click on **Start Searching** <br /> <br />

**Awesome!** 

The setup is done. Try the following commands to see some results.

To get commits for the **python** search that we configured above.
```markdown
source="github_commits://python"
```

To get commits for all the searches in **github_commits** app.
```markdown
source="github_commits://*"
```
