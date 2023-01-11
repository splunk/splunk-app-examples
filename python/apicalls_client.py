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

"""
This example ses the SDK client module, which abstracts away most most of the
  wire level details of invoking the Splunk REST API, but that still presents a
  stateless interface to Splunk the attempts to faithfully represent the
  semantics of the underlying REST API.

The example happens to retrieve a list of installed apps from a given
Splunk instance, but they could apply as easily to any other area of the REST
API."""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
from splunklib import client


def main():
    HOST = "localhost"
    PORT = 8089
    USERNAME = "admin"
    PASSWORD = "changed!"

    service = client.connect(
        host=HOST,
        port=PORT,
        username=USERNAME,
        password=PASSWORD)

    for app in service.apps:
        print(app.name)


if __name__ == "__main__":
    main()
