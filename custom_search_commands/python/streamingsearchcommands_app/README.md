splunk-sdk-python streamingsearchcommands_app example
========================================

Streaming commands process search results one-by-one, applying one transformation to each event that a search returns.

This app provides an example of Streaming Custom search commands which will returns events with a one new field 'fahrenheit'.

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

Copy the `streamingsearchcommands_app` folder in `etc/apps/` inside the container.

Execute the following command from the root of this directory.
```shell
docker cp custom_search_commands/python/streamingsearchcommands_app splunk-app-examples:/opt/splunk/etc/apps/streamingsearchcommands_app
```

### Step 4

Install splunklib in `streamingsearchcommands_app/lib` folder. 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
```
```shell
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/streamingsearchcommands_app/lib
```
*If the last command fails, manually copy the `splunklib` in `/etc/apps/streamingsearchcommands_app/lib` directory inside container*

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

Log in into the Splunk UI, Go to http://localhost:8000/en-US/app/streamingsearchcommands_app/search page and run the following search query:
```
| makeresults count=5 | eval celsius = random()%100 | streamingcsc
```
Results:

celsius| fahrenheit |
:-----|:-----|
98 | 208.4 |
96| 204.8 |
66| 150.8 |
58| 136.4 |
33| 91.4 |
Note: Here celsius value may vary per query, so fahrenheit value will change according to celsius value.
