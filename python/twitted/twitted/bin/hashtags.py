#!/usr/bin/env python
# coding=utf-8
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


import os
import sys
import json
from collections import Counter

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
from splunklib.searchcommands import dispatch, ReportingCommand, Configuration, Option, validators
from splunklib.searchcommands import splunklib_logger


@Configuration(requires_preop=True)
class HashTags(ReportingCommand):

    @Configuration()
    def map(self, records):

        for record in records:
            try:
                raw_record = record.get("_raw")
                python_record = json.loads(raw_record, strict=False)

                users = python_record.get("includes").get("users")
                for user in users:
                    entities = user.get("entities")
                    if entities:
                        description = entities.get("description")
                        if description:
                            hashtags = description.get("hashtags")
                            if hashtags:
                                for hashtag in hashtags:
                                    if hashtag:
                                        yield {"hashtag": hashtag.get("tag"), "_time": record.get("_time")}
            except Exception as e:
                print(e)

    def reduce(self, events):
        for event in events:
            yield event


dispatch(HashTags, sys.argv, sys.stdin, sys.stdout, __name__)
