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
This example uses the SDK's lower level binding module to access the Splunk REST API.
The binding module handles authentication details (and some additional book-
keeping details not demonstrated by this sample) and the result is a much
simplified interaction with Splunk

The example happens to retrieve a list of installed apps from a given
Splunk instance, but they could apply as easily to any other area of the REST
API.
"""

from xml.etree import ElementTree
from splunklib import binding


def main():
    HOST = "localhost"
    PORT = 8089
    USERNAME = "admin"
    PASSWORD = "changed!"

    context = binding.connect(
        host=HOST,
        port=PORT,
        username=USERNAME,
        password=PASSWORD)

    response = context.get('apps/local')
    if response.status != 200:
        raise Exception(f"{response.status} ({response.reason})")

    body = response.body.read()
    data = ElementTree.XML(body)
    apps = data.findall("{http://www.w3.org/2005/Atom}entry/{http://www.w3.org/2005/Atom}title")
    for app in apps:
        print(app.text)


if __name__ == "__main__":
    main()
