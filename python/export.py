#!/usr/bin/env python
#
# Copyright 2012 Splunk, Inc.
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
#Export
This example exports a splunk index using the streaming export endpoint
using a parameterized chunking mechanism.

This is a sample application to export a portion, or all, events in a
specific, or all, indices to a CSV file

The CLI arguments for the export are as follows (all arguments are of the form
`arg=value`):

    --index 	specifies the index to export. Default is all indexes.
    --progress 	prints progress to stdout. Default is no progress shown.
    --starttime	starttime in SECONDS from 1970. Default is start at beginning of
                index.
    --endtime	endtime in SECONDS from 1970. Default is end at the end of the
                index.
    --output	output file name. Default is the current working directory,
                export.out.
    --limit		limits the number of events per chunk. The number actually used
                may be smaller than this limit. Deafult is 100,000.
    --restart	restarts the export if terminated prematurely.
    --omode		specifies the output format of the resulting export, the
                allowable formats are xml, json, csv.

### Friendly start/end times

Currently, the start/end times are given as seconds from 1970, which is not
the most friendly/intuitive format.

## Notes

* 	When using csv or json output formats, sideband messages are not included. If
    you wish to capture sideband messages, the xml format should be used.
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
import time
from os import path

# splunk support files
from splunklib.binding import connect
from utils import parse

# hidden file
OUTPUT_FILE = "./export.out"
OUTPUT_MODE = "xml"
OUTPUT_MODES = ["csv", "xml", "json"]

CLIRULES = {
    'end': {
        'flags': ["--endtime"],
        'default': "",
        'help': "Start time of export (default is start of index)"
    },
    'index': {
        'flags': ["--index"],
        'default': "*",
        'help': "Index to export (default is all user defined indices)"
    },
    'omode': {
        'flags': ["--omode"],
        'default': OUTPUT_MODE,
        'help': f"output format {OUTPUT_MODES} default is {OUTPUT_MODE}"
    },
    'output': {
        'flags': ["--output"],
        'default': OUTPUT_FILE,
        'help': f"Output file name (default is {OUTPUT_FILE})"
    },
    'recover': {
        'flags': ["--recover"],
        'default': False,
        'help': "Export attempts to recover from end of existing export"
    },
    'search': {
        'flags': ["--search"],
        'default': "search *",
        'help': "search string (default 'search *')"
    },
    'start': {
        'flags': ["--starttime"],
        'default': "",
        'help': "Start time of export (default is start of index)"
    }
}


def get_csv_next_event_start(location, event_buffer):
    """ determin the event start and end of *any* valid event """

    start = -1
    end = -1

    event_start = event_buffer.find("\n", location + 1)
    event_end = event_buffer.find('"\n', event_start + 1)

    while event_end > 0:
        parts = event_buffer[event_start:event_end].split(",")
        # test parts 0 and 1 of CSV. Format should be time.qqq, anything
        # else is not time stamp to keep moving.
        try:
            int(parts[0].replace('\n', ""))
            timestamp = parts[1].replace('"', "")
            timeparts = timestamp.split('.')
            int(timeparts[0])
            int(timeparts[1])
            return event_start, event_end
        except:
            event_start = event_buffer.find("\n", event_end + 2)
            event_end = event_buffer.find('"\n', event_start + 1)

    return (start, end)


def get_csv_event_start(event_buffer):
    """ get the event start of an event that is different (in time)from the
        adjoining event, in CSV format """

    (start, end) = get_csv_next_event_start(0, event_buffer)
    if start < 0:
        return -1, -1, ""

    print(event_buffer[start:end])

    tstart = event_buffer.find(",", start)
    tend = event_buffer.find(",", tstart + 1)
    print(event_buffer[tstart:tend])
    last_time = event_buffer[tstart + 1:tend].replace('"', "")

    while end > 0:
        (start, end) = get_csv_next_event_start(start, event_buffer)
        if end < 0:
            return -1, -1, ""
        tstart = event_buffer.find(",", start)
        tend = event_buffer.find(",", tstart + 1)
        this_time = event_buffer[tstart + 1:tend].replace('"', "")
        if this_time != last_time:
            return start, end + 1, last_time

    return -1, -1, ""


def get_xml_event_start(event_buffer):
    """ get the event start of an event that is different (in time)from the
        adjoining event, in XML format """

    result_pattern = "<result offset='"
    time_key_pattern = "<field k='_time'>"
    time_start_pattern = "<value><text>"
    time_end_pattern = "<"
    event_end_pattern = "</result>"

    event_start = event_buffer.find(result_pattern)
    event_end = event_buffer.find(event_end_pattern, event_start) + \
                len(event_end_pattern)
    if event_end < 0:
        return -1, -1, ""
    time_key_start = event_buffer.find(time_key_pattern, event_start)
    time_start = event_buffer.find(time_start_pattern, time_key_start) + \
                 len(time_start_pattern)
    time_end = event_buffer.find(time_end_pattern, time_start + 1)
    last_time = event_buffer[time_start:time_end]

    # wallk through events until time changes
    event_start = event_end
    while event_end > 0:
        event_start = event_buffer.find(result_pattern, event_start + 1)
        event_end = event_buffer.find(event_end_pattern, event_start) + \
                    len(event_end_pattern)
        if event_end < 0:
            return -1, -1, ""
        time_key_start = event_buffer.find(time_key_pattern, event_start)
        time_start = event_buffer.find(time_start_pattern, time_key_start)
        time_end = event_buffer.find(time_end_pattern, time_start)
        this_time = event_buffer[time_start:time_end]
        if this_time != last_time:
            return event_start, event_end, last_time
        event_start = event_end

    return -1, -1, ""


def get_json_event_start(event_buffer):
    """ get the event start of an event that is different (in time)from the
        adjoining event, in XML format """

    event_start_pattern = '{"_cd":"'
    time_key_pattern = '"_time":"'
    time_end_pattern = '"'
    event_end_pattern = '"},\n'
    event_end_pattern2 = '"}[]'  # old json output format bug

    event_start = event_buffer.find(event_start_pattern)
    event_end = event_buffer.find(event_end_pattern, event_start) + \
                len(event_end_pattern)
    if event_end < 0:
        event_end = event_buffer.find(event_end_pattern2, event_start) + \
                    len(event_end_pattern2)
    if event_end < 0:
        return -1, -1, ""

    time_start = event_buffer.find(time_key_pattern, event_start) + \
                 len(time_key_pattern)
    time_end = event_buffer.find(time_end_pattern, time_start + 1)
    last_time = event_buffer[time_start:time_end]

    event_start = event_end
    while event_end > 0:
        event_start = event_buffer.find(event_start_pattern, event_start + 1)
        event_end = event_buffer.find(event_end_pattern, event_start) + \
                    len(event_end_pattern)
        if event_end < 0:
            event_end = event_buffer.find(event_end_pattern2, event_start) + \
                        len(event_end_pattern2)
        if event_end < 0:
            return -1, -1, ""
        time_start = event_buffer.find(time_key_pattern, event_start) + \
                     len(time_key_pattern)
        time_end = event_buffer.find(time_end_pattern, time_start + 1)
        this_time = event_buffer[time_start:time_end]
        if this_time != last_time:
            return event_start - 2, event_end, last_time
        event_start = event_end

    return -1, -1, ""


def get_event_start(event_buffer, event_format):
    """ dispatch event start method based on event format type """

    if event_format == "csv":
        return get_csv_event_start(event_buffer)
    if event_format == "xml":
        return get_xml_event_start(event_buffer)
    return get_json_event_start(event_buffer)


def recover(options):
    """ recover from an existing export run. We do this by
        finding the last time change between events, truncate the file
        and restart from there """

    event_format = options.kwargs['omode']

    buffer_size = 64 * 1024
    with open(options.kwargs['output'], "r+") as fpd:
        fpd.seek(0, 2)  # seek to end
        fptr = max(fpd.tell() - buffer_size, 0)
        fptr_eof = 0

        while fptr > 0:
            fpd.seek(fptr)
            event_buffer = fpd.read(buffer_size)
            (event_start, next_event_start, last_time) = \
                get_event_start(event_buffer, event_format)
            if event_start != -1:
                fptr_eof = event_start + fptr
                break
            fptr = fptr - buffer_size

        if fptr < 0:
            # didn't find a valid event, so start over
            fptr_eof = 0
            last_time = 0

        # truncate file here
        fpd.truncate(fptr_eof)
        fpd.seek(fptr_eof)
        fpd.write("\n")

    return last_time


def cleanup_tail(options):
    """ cleanup the tail of a recovery """

    if options.kwargs['omode'] == "csv":
        options.kwargs['fd'].write("\n")
    elif options.kwargs['omode'] == "xml":
        options.kwargs['fd'].write("\n</results>\n")
    else:
        options.kwargs['fd'].write("\n]\n")


def export(options, service):
    """ main export method: export any number of indexes """

    start = options.kwargs['start']
    end = options.kwargs['end']
    fixtail = options.kwargs['fixtail']
    once = True

    squery = options.kwargs['search']
    squery = squery + f" index={options.kwargs['index']}"
    if start != "":
        squery = squery + f" earliest_time={start}"
    if end != "":
        squery = squery + f" latest_time={end}"

    success = False

    while not success:
        # issue query to splunkd
        # count=0 overrides the maximum number of events
        # returned (normally 50K) regardless of what the .conf
        # file for splunkd says.
        result = service.get('search/jobs/export',
                             search=squery,
                             output_mode=options.kwargs['omode'],
                             timeout=60,
                             earliest_time="0.000",
                             time_format="%s.%Q",
                             count=0)

        if result.status != 200:
            print(f"warning: export job failed: {result.status}, sleep/retry")
            time.sleep(60)
        else:
            success = True

    # write export file
    while True:
        if fixtail and once:
            cleanup_tail(options)
            once = False
        content = result.body.read()
        if len(content) == 0:
            break
        options.kwargs['fd'].write(content)
        options.kwargs['fd'].write("\n")

    options.kwargs['fd'].flush()


def main():
    """ main entry """
    options = parse(sys.argv[1:], CLIRULES, ".env")

    if options.kwargs['omode'] not in OUTPUT_MODES:
        print(f"output mode must be one of {OUTPUT_MODES}, found {options.kwargs['omode']}")
        sys.exit(1)

    service = connect(**options.kwargs)

    if os.path.exists(options.kwargs['output']):
        if not options.kwargs['recover']:
            print(f"Export file {options.kwargs['output']} exists, and recover option nor specified")
            sys.exit(1)
        else:
            options.kwargs['end'] = recover(options)
            options.kwargs['fixtail'] = True
            openmode = "a"
    else:
        openmode = "w"
        options.kwargs['fixtail'] = False

    try:
        options.kwargs['fd'] = open(options.kwargs['output'], openmode)
    except IOError:
        print(f"Failed to open output file {options.kwargs['output']} w/ mode {openmode}")
        sys.exit(1)

    export(options, service)


if __name__ == '__main__':
    main()
