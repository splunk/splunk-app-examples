splunk-sdk-python twitted example
========================================

This app provides an example of Reporting Custom search commands.
1. `hashtags` will list out all the hashtags from the tweets
2. `tophashtags` will list out top _**n**_ hashtags where _**n**_ is passed as an option. _(i.e. top=5)_

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

Copy the `twitted/twitted` folder in `etc/apps/` inside of the container.

Execute the following command from the root of this directory.
```shell
docker cp python/twitted/twitted splunk-app-examples:/opt/splunk/etc/apps/twitted
```

### Step 4

Install splunklib in `twitted/lib` folder. 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
```
```shell
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/twitted/lib
```
*If the last command fails, manually copy the `splunklib` in `/etc/apps/twitted/lib` directory inside container*

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

Log in into the Splunk UI, Go to http://localhost:8000/en-US/app/twitted/search page and run the following search query:

Results:

```shell
index="twitter" | hashtags
```

```shell
index="twitter" | tophashtags top=10
```
