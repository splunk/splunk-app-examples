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
class TopHashTags(ReportingCommand):
    top = Option(require=True, validate=validators.Integer(0))

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
                                        yield {"hashtag": hashtag.get("tag")}
            except Exception as e:
                print(e)

    def reduce(self, hashtags):
        hashtags_list = []
        top_5_tags = []

        for hashtag in hashtags:
            hashtags_list.append(hashtag.get("hashtag"))

        c = Counter(hashtags_list)

        tags = {}
        for tag, count in c.most_common(self.top):
            tags[tag] = count

        percent = []
        sum_of_hash = sum(list(tags.values()))

        for i in list(tags.values()):
            percent.append(f"{i / sum_of_hash * 100:.2f}")

        for index in range(len(tags)):
            yield {"hashtag": list(tags.keys())[index], "count": list(tags.values())[index], "percent": percent[index]}


dispatch(TopHashTags, sys.argv, sys.stdin, sys.stdout, __name__)
