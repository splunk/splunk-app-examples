#!/usr/bin/env python

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
from splunklib.searchcommands import \
    dispatch, EventingCommand, Configuration, Option, validators


@Configuration()
class %(command.title())Command(EventingCommand):
    """ %(synopsis)

    ##Syntax

    %(syntax)

    ##Description

    %(description)

    """
    def transform(self, events):
       # Put your event transformation code here

       # service instance is available which is instantiated using the server-uri and other meta details to connect to Splunk Service
       # service = self.service

       pass

dispatch(%(command.title())Command, sys.argv, sys.stdin, sys.stdout, __name__)
