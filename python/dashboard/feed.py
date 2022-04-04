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

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from splunklib import six
from six.moves import input
import splunklib.client as client
import splunklib.results as results
from python.utils import error, parse
import pandas as pd
import matplotlib.pyplot as plt


def plot_top_hash_tags(service):
    job = service.jobs.create('search index=twitter | tophashtags top=10', **{"exec_mode": "normal"})

    while True:
        while not job.is_done():
            pass
        break

    events = []
    for result in results.JSONResultsReader(job.results(output_mode='json')):
        events.append(result)

    if len(events) <= 0:
        print("No events found to plot")
        return

    df = pd.DataFrame(events)
    df["hashtag"] = df["hashtag"].astype(str)
    df["count"] = df["count"].astype(float)
    df["percent"] = df["percent"].astype(float)

    plt.bar(df["hashtag"], df["count"])
    plt.xlabel("Hashtags")
    plt.ylabel("Count")
    plt.show()


def plot_top_sources(service):
    query = 'search index=twitter | spath | rename data.source as source | stats count(source) as count by source | sort -count | head 10'
    job = service.jobs.create(query, **{"exec_mode": "normal"})

    while True:
        while not job.is_done():
            pass
        break

    events = []

    for result in results.JSONResultsReader(job.results(output_mode='json')):
        events.append(result)

    if len(events) <= 0:
        print("No events found to plot")
        return

    df = pd.DataFrame(events)
    df["source"] = df["source"].astype(str)
    df["count"] = df["count"].astype(float)

    plt.bar(df["source"], df["count"])
    plt.xlabel("Source")
    plt.ylabel("Count")
    plt.show()


def plot_lang(service):
    query = 'search index=twitter | rename data.lang as language | stats count(language) as count by language'
    job = service.jobs.create(query, **{"exec_mode": "normal"})

    while True:
        while not job.is_done():
            pass
        break

    events = []

    for result in results.JSONResultsReader(job.results(output_mode='json')):
        events.append(result)

    if len(events) <= 0:
        print("No events found to plot")
        return

    df = pd.DataFrame(events)
    df["language"] = df["language"].astype(str)
    df["count"] = df["count"].astype(float)

    plt.bar(df["language"], df["count"])
    plt.xlabel("Language")
    plt.ylabel("Count")
    plt.show()


def plot_annotations(service):
    query = 'search index=twitter | rename includes.tweets{}.entities.annotations{}.type as type | stats count(type) as count by type'
    job = service.jobs.create(query, **{"exec_mode": "normal"})

    while True:
        while not job.is_done():
            pass
        break

    events = []

    for result in results.JSONResultsReader(job.results(output_mode='json')):
        events.append(result)

    if len(events) <= 0:
        print("No events found to plot")
        return

    df = pd.DataFrame(events)
    df["type"] = df["type"].astype(str)
    df["count"] = df["count"].astype(float)

    plt.bar(df["type"], df["count"])
    plt.xlabel("Type")
    plt.ylabel("Count")
    plt.show()


def cmdline():
    kwargs = parse(sys.argv[1:], {}, ".env").kwargs

    # Prompt for Splunk username/password if not provided on command line / in .env
    if 'username' not in kwargs:
        kwargs['username'] = input("Splunk username: ")
    if 'password' not in kwargs:
        kwargs['password'] = getpass("Splunk password:")

    if len(sys.argv) > 1:
        kwargs["function"] = sys.argv[1]
    else:
        kwargs["function"] = None

    return kwargs


functions_dict = {"tophashtags": plot_top_hash_tags,
                  "topsources": plot_top_sources,
                  "lang": plot_lang,
                  "annotations": plot_annotations}


def main():
    try:
        kwargs = cmdline()

        if kwargs["function"] in functions_dict:

            # Force the owner namespace, if not provided
            if 'owner' not in list(kwargs.keys()):
                kwargs['owner'] = kwargs['username']

            print("Initializing Splunk ..")

            service = client.connect(**kwargs)

            functions_dict[kwargs["function"]](service)
        else:
            raise NameError("Please provide a function name from %s as an argument." % list(functions_dict.keys()) )
    except Exception as e:
        print(str(e))


if __name__ == "__main__":
    main()

