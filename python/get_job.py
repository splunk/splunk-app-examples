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

"""A simple example showing to use the Service.job method to retrieve
a search Job by its sid.
"""

import os
import sys
import time

import splunklib.client as client

from utils import parse

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


def main(argv):
    opts = parse(argv, {}, ".env")
    service = client.connect(**opts.kwargs)

    # Execute a simple search, and store the sid
    sid = service.search("search index=_internal | head 5").sid

    # Now, we can get the `Job`
    job = service.job(sid)

    # Wait for the job to complete
    while not job.is_done():
        time.sleep(1)

    print("Number of events found: %d" % int(job["eventCount"]))


if __name__ == "__main__":
    main(sys.argv[1:])
