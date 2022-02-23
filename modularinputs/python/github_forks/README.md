splunk-sdk-python github_forks example
========================================

This app provides an example of a modular input that generates the number of repository forks according to the Github API based on the owner and repo_name provided by the user during setup of the input.

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

Copy the `github_forks` folder in `etc/apps/` inside the container.

Execute the following command from the root of this directory.
```shell
docker cp modularinputs/python/github_forks splunk-app-examples:/opt/splunk/etc/apps/github_forks
```

### Step 4

Install splunklib in `github_forks/lib` folder. 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
```
```shell
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/github_forks/lib
```
*If the last command fails, manually copy the `splunklib` in `/etc/apps/github_forks/lib` directory inside container*

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

Make sure the Splunk is in `healthy` state.

Log in into the Splunk UI, Go to `Settings > DATA > Data inputs`

Search for `Github Repository Forks` (as per the `default/app.conf` file)

Click on the `+Add new` button in front of the `Github Repository Fork` which opens a configuration page for `Github Repository Fork` app.

`name`: Name of your choice to refer to this modularinput later. i.e. pythonforks 

`Owner`: Github user or organization that created the repository. i.e. Splunk

`Repo Name`: Name of the Github repository. i.e. splunk-sdk-python

Once the details are filled, click on `Next` and then click on `Start Searching`


## Awesome!

The setup is done. Try the following commands to see some results.

To get github forks for the `pythonforks` input that we configured above. Search
```markdown
source="github_forks://pythonforks"
```

To get forks for all the searches in `github_forks` app. Search
```markdown
source="github_forks://*"
```

> NOTE: If no Github Forks input appears then the script is likely not running properly, see https://docs.splunk.com/Documentation/SplunkCloud/latest/AdvancedDev/ModInputsDevTools for more details on debugging the modular input using the command line and relevant logs.
