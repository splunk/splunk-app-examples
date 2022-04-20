splunk-sdk-python generatingsearchcommands_app example
========================================

Generating commands fetch information from one or more indexes without performing any transformations. Generating commands are either event-generating or report-generating. These commands do not require any input and appear at the beginning of a search after a leading pipe.

This app provides an example of Generating Custom search commands which will returns generated events equal to count mentioned in query.

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

Go to http://localhost:8000/en-US/app/generatingsearchcommands_app/search page and run the following search query:
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
