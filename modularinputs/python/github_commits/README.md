splunk-sdk-python github_commits example
========================================

This app provides an example of a modular input that Pulls down commit data from GitHub and creates events for each commit. 

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

Search for `Github Commits` (as per the `default/app.conf` file)

Click on the `+Add new` button in front of the `Github Commits` which opens a configuration page for `Github Commits` app.

`name`: Name of your choice to refer to this modularinput later. i.e. python 

`Owner`: Github user or organization that created the repository. i.e. Splunk

`Repo Name`: Name of the Github repository. i.e. splunk-sdk-python

`Token (optional)`: A Github API access token. Required for private repositories (the token must have the 'repo' and 'public_repo' scopes enabled). Recommended to avoid Github's API limit, especially if setting an interval.

Once the details are filled, click on `Next` and then click on `Start Searching`

## Awesome!

The setup is done. Try the following commands to see some results.

To get github commits for the `python` input that we configured above. Search
```markdown
source="github_commits://python"
```

To get commits for all the searches in `github_commits` app. Search
```markdown
source="github_commits://*"
```

> NOTE: If no Github Commits input appears then the script is likely not running properly, see https://docs.splunk.com/Documentation/SplunkCloud/latest/AdvancedDev/ModInputsDevTools for more details on debugging the modular input using the command line and relevant logs.
