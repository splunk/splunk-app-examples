# Example on how to generate chart

This sample shows how to use the Python SDK and Splunk to generate chart for the statistical data.
In this specific case, we use a plot the statistics for the data that we are indexing using the `twitted` example.

## How It Works

There are two logical components to the sample: getting data from Splunk and
generating charts.

1. We fetch the data from Twitter and index it in Splunk.
2. We create various search jobs based on user input, and generate charts.

## How To Run It

Follow the instruction written in **`twitted/README.md`** and `twitted/twitted/README.md` files.

Once you run the twitted example successfully.

Also install `pandas` and `matplotlib`

Open the terminal in dashboard directory and run:
```shell 
python feed.py
```

You'll be asked to provide one of the predefined values as a commandline argument.

i.e 
```shell
python feed.py tophashtags
```