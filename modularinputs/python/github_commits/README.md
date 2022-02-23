splunk-sdk-python github_commits example
========================================

This app provides an example of a modular input that Pulls down commit data from GitHub and creates events for each commit. 

which are then streamed to Splunk, based on the owner and repo_name provided by the user during setup of the input. <br /> <br />

### To run this example locally, follow the below steps.

### Step 1
Execute the following command from the root of this repository.
```shell
SPLUNK_VERSION=latest docker compose up -d
```

### Step 2

Check the container health, run:
```shell
docker ps
```

### Step 3

Make sure STATUS is **healthy** for **splunk-app-examples** container.

Copy the `github_commits` folder in `etc/apps/` inside the container.

Execute the following command from the root of this directory.
```shell
docker cp modularinputs/python/github_commits splunk-app-examples:/opt/splunk/etc/apps/github_commits
```

### Step 4

Install splunklib in `github_commits/lib` folder. 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
```
```shell
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/github_commits/lib
```
*If the last command fails, manually copy the `splunklib` in `/etc/apps/github_commits/lib` directory inside container*

### Step 5

Restart the container.

From UI:
```markdown
Settings > Server controls > Restart Splunk
```

From Terminal:
```shell
docker stop splunk-app-examples
```
```shell
docker start splunk-app-examples
```

### Step 6

Make sure the Splunk is in `healthy` state

Log in into the Splunk UI, Go to `Settings > DATA > Data inputs`

Search for `Github Commits`

Click on the `+Add new` button in front of the `Github Commits` which opens a configuration page for `Github Commits` app <br />

`name`: Name of your choice to refer to this modularinput later. i.e. python 

`Owner`: Github user or organization that created the repository. i.e. Splunk

`Repo Name`: Name of the Github repository. i.e. splunk-sdk-python

`Token (optional)`: A Github API access token. Required for private repositories (the token must have the 'repo' and 'public_repo' scopes enabled). Recommended to avoid Github's API limit, especially if setting an interval.

Once the details are filled, click on `Next` and then click on `Start Searching`

## Awesome!

The setup is done. Try the following commands to see some results.

To get github commits for the `python` modularinput that we configured above. Search
```markdown
source="github_commits://python"
```

To get commits for all the searches in `github_commits` app. Search
```markdown
source="github_commits://*"
```

> NOTE: If no Github Commits input appears then the script is likely not running properly, see https://docs.splunk.com/Documentation/SplunkCloud/latest/AdvancedDev/ModInputsDevTools for more details on debugging the modular input using the command line and relevant logs.
