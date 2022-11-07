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

"""Example of a urllib2 based HTTP request handler."""

import os
import sys
import ssl
import urllib.request
import urllib.error
from io import BytesIO
from pprint import pprint

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from splunklib import client
from python import utils


def request(url, message, **kwargs):
    method = message['method'].lower()
    data = message.get('body', "") if method == 'post' else None
    headers = dict(message.get('headers', []))
    # If running Python 2.7.9+, disable SSL certificate validation
    req = urllib.request.Request(url, data, headers)
    try:
        response = urllib.request.urlopen(req, context=ssl._create_unverified_context())
    except urllib.error.HTTPError as response:
        pass  # Propagate HTTP errors via the returned response message
    return {
        'status': response.code,
        'reason': response.msg,
        'headers': dict(response.info()),
        'body': BytesIO(response.read())
    }


opts = utils.parse(sys.argv[1:], {}, ".env")
service = client.connect(handler=request, **opts.kwargs)
pprint([app.name for app in service.apps])
