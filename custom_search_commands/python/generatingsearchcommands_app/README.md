splunk-sdk-python generatingsearchcommands_app example
========================================

Generating commands fetch information from one or more indexes without performing any transformations. Generating commands are either event-generating or report-generating. These commands do not require any input and appear at the beginning of a search after a leading pipe.

This app provides an example of Generating Custom search commands which will returns generated events equal to count mentioned in query.

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

Copy the `generatingsearchcommands_app` folder in `etc/apps/` inside the container.

Execute the following command from the root of this directory.
```shell
docker cp custom_search_commands/python/generatingsearchcommands_app splunk-app-examples:/opt/splunk/etc/apps/generatingsearchcommands_app
```

### Step 4

Install splunklib in `generatingsearchcommands_app/lib` folder. 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
```
```shell
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/generatingsearchcommands_app/lib
```
*If the last command fails, manually copy the `splunklib` in `/etc/apps/generatingsearchcommands_app/lib` directory inside container*

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

Log in into the Splunk UI, Go to http://localhost:8000/en-US/app/generatingsearchcommands_app/search page and run the following search query:
```
| generatingcsc count=4
```
Results:

Event |
:-----|
Test Event 1 |
Test Event 2 |
Test Event 3 |
Test Event 4 |
