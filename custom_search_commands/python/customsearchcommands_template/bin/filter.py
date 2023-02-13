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

       # To connect with Splunk, use the instantiated service object which is created using the server-uri and
       # other meta details and can be accessed as shown below
       # Example:-
       #    service = self.service

       pass

dispatch(%(command.title())Command, sys.argv, sys.stdin, sys.stdout, __name__)
