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
import os
import sys

from setuptools import setup, Command

FAILED = False


def run_test_suite():
    import unittest

    def mark_failed():
        global FAILED
        FAILED = True

    class _TrackingTextTestResult(unittest._TextTestResult):
        def addError(self, test, err):
            unittest._TextTestResult.addError(self, test, err)
            mark_failed()

        def addFailure(self, test, err):
            unittest._TextTestResult.addFailure(self, test, err)
            mark_failed()

    class TrackingTextTestRunner(unittest.TextTestRunner):
        def _makeResult(self):
            return _TrackingTextTestResult(
                self.stream, self.descriptions, self.verbosity)

    original_cwd = os.path.abspath(os.getcwd())
    os.chdir('tests')
    suite = unittest.defaultTestLoader.discover('.')
    runner = TrackingTextTestRunner(verbosity=2)
    runner.run(suite)
    os.chdir(original_cwd)

    return FAILED


def run_test_suite_with_junit_output():
    import unittest
    import xmlrunner
    original_cwd = os.path.abspath(os.getcwd())
    os.chdir('tests')
    suite = unittest.defaultTestLoader.discover('.')
    xmlrunner.XMLTestRunner(output='../test-reports').run(suite)
    os.chdir(original_cwd)


class CoverageCommand(Command):
    """setup.py command to run code coverage of the test suite."""
    description = "Create an HTML coverage report from running the full test suite."
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        try:
            import coverage
        except ImportError:
            print("Could not import coverage. Please install it and try again.")
            sys.exit(1)
        cov = coverage.coverage(source=['splunklib'])
        cov.start()
        run_test_suite()
        cov.stop()
        cov.html_report(directory='coverage_report')


class TestCommand(Command):
    """setup.py command to run the whole test suite."""
    description = "Run test full test suite."
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        FAILED = run_test_suite()
        if FAILED:
            sys.exit(1)


class JunitXmlTestCommand(Command):
    """setup.py command to run the whole test suite."""
    description = "Run test full test suite with JUnit-formatted output."
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        run_test_suite_with_junit_output()


setup(
    author="Splunk, Inc.",

    cmdclass={'coverage': CoverageCommand,
              'test': TestCommand,
              'testjunit': JunitXmlTestCommand},

    description="The Splunk Python SDK Commandline Examples.",

    license="http://www.apache.org/licenses/LICENSE-2.0",

    classifiers=[
        "Programming Language :: Python",
        "Development Status :: 6 - Mature",
        "Environment :: Other Environment",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Software Development :: Libraries :: Application Frameworks",
    ],
)
