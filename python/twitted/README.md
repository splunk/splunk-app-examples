# Twitted 

This is a simple Splunk application that indexes the output of the Twitter stream API and provides a collection of saved searches for inspecting the
resulting Twitter data.

This sample serves two purposes: first, it's a fun and readily available data
source to use to learn and explore Splunk, and second, the input script
demonstrates how to use the SDK to "push" data into Splunk using a TCP input.

Note that the input script is not implemented as a Splunk scripted input. It's
designed to run standalone so that it's convenient for you to experiment with.
If this were a real Splunk app, the input Script would be written as a full
Splunk scripted input so that Splunk could manage its execution.

To run this example we need two tokens.

1. Twitter token: 
   - Go to [Twitter developer dashboard](https://developer.twitter.com/en/portal/dashboard).
   - Create a new project and follow the instructions.
   - At the end, you'll be prompted with API key, API key secret and a Bearer token.
   - Copy the tokens and store it somewhere safe.
   

2. HEC token:
    - Login into Splunk UI dashboard.
    - Go to `Settings > Data inputs > HTTP Event Collector`
    - Go to `Global Settings` and make sure,
      - `All Tokens` is `Enabled`
      - `Enable SSL` is unchecked, for this example.
      - `HTTP Port Number` is `8088` and click on `Save`
    - Click on `New Token`
      - Enter the `Name` for the HEC token and click on Next. (i.e. twitter_token)
      - Click on `Create a new index` in front of `Default Index`, Enter `twitter` for `Index Name` and click on `Save`
      - Make sure `Default Index` is `twitter` and click on `Review`
      - Click on `Submit` and Copy the Token value and save it somewhere safe.
      

Awesome, now we have Twitter bearer token and Splunk HEC token.

Run:

```shell
python input.py
```

It will ask for Twitter bearer token. Copy and paste the Twitter bearer token and hit enter.
It will ask for Splunk HEC token. Copy and paste the Splunk HEC token and hit enter.

Wait for the sometime. 100 tweets would be fetched and logged into Splunk under the `twitter` index.

To test this, Go to Splunk UI > Search & Reporting, enter `index="twitter"` and hit enter. Tweets fetched from the Twitter will  get rendered.

For the next part read the `twitted/twitted/README.md`
