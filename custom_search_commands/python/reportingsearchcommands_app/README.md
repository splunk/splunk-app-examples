splunk-sdk-python reportingsearchcommands_app example
========================================

Transforming commands order search results into a data table. These commands "transform" the specified cell values for each event into numerical values that Splunk software can use for statistical purposes.

This app provides an example of Reporting Custom search commands which will returns a count of students having higher total marks than cutoff marks.

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

Go to http://localhost:8000/en-US/app/reportingsearchcommands_app/search page and run the following search query:
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
