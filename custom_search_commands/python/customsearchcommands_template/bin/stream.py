#!/usr/bin/env python

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
from splunklib.searchcommands import \
    dispatch, StreamingCommand, Configuration, Option, validators


@Configuration()
class %(command.title())Command(StreamingCommand):
    """ %(synopsis)

    ##Syntax

    %(syntax)

    ##Description

    %(description)

    """
    def stream(self, events):
        # service instance is available which is instantiated using the server-uri and other meta details to connect to Splunk Service
        # service = self.service
        # Put your event transformation code here
        for event in events:
            yield event

dispatch(%(command.title())Command, sys.argv, sys.stdin, sys.stdout, __name__)
