splunk-sdk-python eventingsearchcommands_app example
========================================

Eventing/Dataset processing commands require the entire dataset in place before the command can run. These commands are not transforming, not distributable, not streaming, and not orchestrating. Some of these commands fit into other types in specific situations or when specific arguments are used.

Applies a transformation to search results as they travel through the events pipeline.

Eventing commands typically filter, group, order, and/or or augment event records. Examples of eventing commands from Splunk’s built-in command set include sort, dedup, and cluster. Each execution of an eventing command should produce a set of event records that is independently usable by downstream processors.


This app provides an example of Eventing Custom search commands which will only returns events having a same status mentioned in query.

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
Log in into the Splunk UI.

Go to http://localhost:8000/en-US/app/eventingsearchcommands_app/search page and run the following search query:
```
index="_internal" | head 4000 | eventingcsc status=200
```
Results:
- We'll see events having status value 200 as mentioned in query
