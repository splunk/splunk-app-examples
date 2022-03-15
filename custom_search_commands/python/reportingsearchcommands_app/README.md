splunk-sdk-python reportingsearchcommands_app example
========================================

Transforming commands order search results into a data table. These commands "transform" the specified cell values for each event into numerical values that Splunk software can use for statistical purposes.

This app provides an example of Reporting Custom search commands which will returns a count of students having higher total marks than cutoff marks.

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

Copy the `reportingsearchcommands_app` folder in `etc/apps/` inside the container.

Execute the following command from the root of this directory.
```shell
docker cp custom_search_commands/python/reportingsearchcommands_app splunk-app-examples:/opt/splunk/etc/apps/reportingsearchcommands_app
```

### Step 4

Install splunklib in `reportingsearchcommands_app/lib` folder. 
```shell
docker exec -it -u root splunk-app-examples /bin/bash
```
```shell
pip install splunk-sdk -t ${SPLUNK_HOME}/etc/apps/reportingsearchcommands_app/lib
```
*If the last command fails, manually copy the `splunklib` in `/etc/apps/reportingsearchcommands_app/lib` directory inside container*

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

Log in into the Splunk UI, Go to http://localhost:8000/en-US/app/reportingsearchcommands_app/search page and run the following search query:
```
| makeresults count=10
| eval math=random()%100, eng=random()%100, cs=random()%100
| reportingcsc cutoff=150 math eng cs
```
Results:

student having total marks greater than cutoff|
:-----|
3 |
Note: Here total may vary per query, so we'll get result value between 0<=ans<=count.
