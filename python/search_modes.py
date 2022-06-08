import sys
import time
from utils import *
from splunklib.client import connect
from splunklib import results


def cmdline(argv, flags, **kwargs):
    """A cmdopts wrapper that takes a list of flags and builds the
       corresponding cmdopts rules to match those flags."""
    rules = {flag: {'flags': [f"--{flag}"]} for flag in flags}
    return parse(argv, rules, ".env", **kwargs)


def modes(argv):
    opts = cmdline(argv, [])
    kwargs_splunk = dslice(opts.kwargs, FLAGS_SPLUNK)
    service = connect(**kwargs_splunk)

    # By default the job will run in 'smart' mode which will omit events for transforming commands
    job = service.jobs.create('search index=_internal | head 10 | top host')
    while not job.is_ready():
        time.sleep(0.5)

    reader = results.JSONResultsReader(job.events(output_mode="json"))
    # Events found: 0
    print(f'Events found with adhoc_search_level="smart": {len(list(reader))}')

    # Now set the adhoc_search_level to 'verbose' to see the events
    job = service.jobs.create('search index=_internal | head 10 | top host', adhoc_search_level='verbose')
    while not job.is_ready():
        time.sleep(0.5)

    reader = results.JSONResultsReader(job.events(output_mode="json"))
    # Events found: 10
    print(f'Events found with adhoc_search_level="verbose": {len(list(reader))}')


if __name__ == "__main__":
    modes(sys.argv[1:])
