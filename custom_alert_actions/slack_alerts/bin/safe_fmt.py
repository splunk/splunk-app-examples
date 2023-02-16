from string import Formatter
from collections import Mapping
import json

try:
    from _string import formatter_field_name_split
except ImportError:
    formatter_field_name_split = lambda x: x._formatter_field_name_split()

class MagicFormatMapping(Mapping):
    def __init__(self, args, kwargs):
        self._args = args
        self._kwargs = kwargs
        self._last_index = 0

    def __getitem__(self, key):
        if key == '':
            idx = self._last_index
            self._last_index += 1
            try:
                return self._args[idx]
            except LookupError:
                pass
            key = str(idx)
        return self._kwargs[key]

    def __iter__(self):
        return iter(self._kwargs)

    def __len__(self):
        return len(self._kwargs)

class SafeFormatter(Formatter):
    def get_field(self, field_name, args, kwargs):
        try:
            first, rest = formatter_field_name_split(field_name)
            obj = self.get_value(first, args, kwargs)
            for _, i in rest:
                if isinstance(i, int):
                    obj = obj[str(i)]
                else:
                    obj = obj[i]
            return obj, first
        except:
            return '{%s}' % field_name, first

    def format_field(self, value, spec):
        if isinstance(value, dict) or isinstance(value, list):
            return json.dumps(value)
        return Formatter.format_field(self, value, spec)

def safe_format(_string, kwargs=dict()):
    return SafeFormatter().vformat(_string, [], MagicFormatMapping([], kwargs))
