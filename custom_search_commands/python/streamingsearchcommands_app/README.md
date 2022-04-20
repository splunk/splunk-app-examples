splunk-sdk-python streamingsearchcommands_app example
========================================

Streaming commands process search results one-by-one, applying one transformation to each event that a search returns.

This app provides an example of Streaming Custom search commands which will returns events with a one new field 'fahrenheit'.

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

Go to http://localhost:8000/en-US/app/streamingsearchcommands_app/search page and run the following search query:
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
