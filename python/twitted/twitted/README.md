splunk-sdk-python twitted example
========================================

This app provides an example of Reporting Custom search commands.
1. `hashtags` will list out all the hashtags from the tweets
2. `tophashtags` will list out top _**n**_ hashtags where _**n**_ is passed as an option. _(i.e. top=5)_

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

Log in into the Splunk UI, Go to http://localhost:8000/en-US/app/twitted/search page and run the following search queries:

Results:

```shell
index="twitter" | hashtags
```

```shell
index="twitter" | tophashtags top=10
```
