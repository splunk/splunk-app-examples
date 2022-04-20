splunk-sdk-python github_forks example
========================================

This app provides an example of a modular input that generates the number of repository forks according to the Github API based on the owner and repo_name provided by the user during setup of the input.

### To run this example locally, follow the below steps.

### Step 1
Execute the following command from the root of this repository.
```shell
make up
```

### Step 2
Make sure the Splunk is in `healthy` state., run:
```shell
docker ps
```

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
