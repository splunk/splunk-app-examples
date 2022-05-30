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

splunkhome = os.environ['SPLUNK_HOME']
sys.path.append(os.path.join(splunkhome, 'etc', 'apps', 'customsearchcommands_app', 'lib'))
from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option


@Configuration()
class FilterCommand(EventingCommand):
    """ Filters and updates records on the events stream.

    :code:`filter contains="value1" replace="value to be replaced,value to replace with"`

    **Description**

    The :code:`filter` command filters records from the events stream returning only those which has
    :code:`contains` in them and replaces :code:`replace_array[0]` with :code:`replace_array[1]`.
    If no :code:`contains` is specified, all records are returned.
    If no :code:`update` is specified, records are returned unmodified.

    ##Example

    Only include the events which has 'World' in them and then replace 'World' with 'There'

    :code:`index="*" | filter contains="World" replace_array="World,There"`

    """

    contains = Option()
    replace_array = Option()

    def transform(self, records):
        contains = self.contains
        replace_array = self.replace_array

        if contains and replace_array:
            arr = replace_array.split(",")
            if len(arr) != 2:
                raise ValueError("Please provide only two arguments, separated by comma for 'replace'")

            for record in records:
                _raw = record.get("_raw")
                if contains in _raw:
                    record["_raw"] = _raw.replace(arr[0], arr[1])
                    yield record
            return

        if contains:
            for record in records:
                _raw = record.get("_raw")
                if contains in _raw:
                    yield record
            return

        if replace_array:
            arr = replace_array.split(",")
            if len(arr) != 2:
                raise ValueError("Please provide only two arguments, separated by comma for 'replace'")

            for record in records:
                _raw = record.get("_raw")
                record["_raw"] = _raw.replace(arr[0], arr[1])
                yield record
            return

        for record in records:
            yield record


dispatch(FilterCommand, sys.argv, sys.stdin, sys.stdout, __name__)
