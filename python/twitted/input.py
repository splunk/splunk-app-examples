#!/usr/bin/env python
#
# Copyright 2011-2015 Splunk, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License"): you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software 
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT 
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the 
# License for the specific language governing permissions and limitations 
# under the License.

import json
import os
import sys
from getpass import getpass
import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
import splunklib.client as client
from python.utils import error, parse

TWITTER_STREAM_HOST = "https://api.twitter.com"
TWITTER_STREAM_PATH = "/2/tweets/sample/stream"


# Get 100 tweets from Twitter
MAX_COUNT = 100

verbose = 1
TWITTER_BEARER_TOKEN = ""
SPLUNK_HEC_TOKEN = ""
count = 0


def process_tweets():
    for event in stream_generator():
        send_tweets(event)


def stream_generator():
    try:
        global count
        token = f"Bearer {TWITTER_BEARER_TOKEN}"
        headers = {
            'Authorization': token,
            'User-Agent': "twitted.py/0.1",
            'Accept': "*/*",
            'Accept-Encoding': "gzip, deflare, br",
            'Connection': 'keep-alive'
        }

        session = requests.Session()
        params = {'tweet.fields': 'source,geo,id,lang,text,created_at,entities',
                  'user.fields': 'username,name,profile_image_url,entities,id',
                  'expansions': 'geo.place_id,in_reply_to_user_id,'
                                'referenced_tweets.id,entities.mentions.username,referenced_tweets.id.author_id'}

        response = session.get(TWITTER_STREAM_HOST + TWITTER_STREAM_PATH, params=params, headers=headers, stream=True)

        if not response.ok:
            raise Exception(response.json().get("detail"))

        for line in response.iter_lines():
            if count != MAX_COUNT and line:
                count += 1
                yield line
            else:
                break

        response.close()
        print(count, "events sent to HEC")

    except Exception as e:
        error(f"Error occurred while fetching stream from Twitter: {str(e)}", 2)


def send_tweets(record):
    try:
        record_dict = json.loads(record)

        url = "http://localhost:8088/services/collector"
        event = {"event": record_dict, "sourcetype": "_json"}
        token = f"Splunk {SPLUNK_HEC_TOKEN}"
        headers = {"Authorization": token}

        response = requests.post(url, headers=headers, json=event)

        if response.status_code != 200:
            raise Exception(response.json())

    except Exception as e:
        error(f"Error occurred while sending tweets to HEC: {str(e)}", 2)


RULES = {
    'verbose': {
        'flags': ["--verbose"],
        'default': 1,
        'type': "int",
        'help': "Verbosity level (0-3, default 0)",
    }
}


def cmdline():
    kwargs = parse(sys.argv[1:], RULES, ".env").kwargs

    if 'twitter_bearer_token' not in kwargs:
        kwargs['twitter_bearer_token'] = getpass("Twitter bearer token: ")

    if 'splunk_hec_token' not in kwargs:
        kwargs['splunk_hec_token'] = getpass("Splunk HEC token: ")
    print(kwargs)
    # Prompt for Splunk username/password if not provided on command line
    if 'username' not in kwargs:
        kwargs['username'] = input("Splunk username: ")
    if 'password' not in kwargs:
        kwargs['password'] = getpass("Splunk password:")

    return kwargs


def main():
    try:

        kwargs = cmdline()

        global TWITTER_BEARER_TOKEN
        global SPLUNK_HEC_TOKEN
        global verbose

        TWITTER_BEARER_TOKEN = kwargs['twitter_bearer_token']
        SPLUNK_HEC_TOKEN = kwargs['splunk_hec_token']
        verbose = kwargs['verbose']

        # Force the owner namespace, if not provided
        if 'owner' not in list(kwargs.keys()):
            kwargs['owner'] = kwargs['username']

        if verbose > 0:
            print("Initializing Splunk ..")

        service = client.connect(**kwargs)

        # Create the index if it doesn't exist
        if 'twitter' not in service.indexes:
            if verbose > 0:
                print("Creating index 'twitter' ..")
            service.indexes.create("twitter")

        if verbose > 0:
            print(f"Sending data to HEC at {'localhost'}:{8088} ...")

        process_tweets()

    except Exception as e:
        error(f"Exception occurred during operation:\n{str(e)}", 2)


if __name__ == "__main__":
    main()
