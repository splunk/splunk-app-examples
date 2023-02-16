import unittest
from slack import build_alert_attachment, build_fields_attachment, format_template

class TestAttachments(unittest.TestCase):
    def test_build_alert_attachment_does_not_raise(self):
        build_alert_attachment(dict(configuration=dict()))

    def test_build_fields_attachment_does_not_raise(self):
        build_fields_attachment(dict(configuration=dict()))

    def test_build_fields_attachment(self):
        result = build_fields_attachment(dict(
            configuration=dict(fields='foo, bar*'),
            result=dict(
                foo='YOLO',
                bar1='hi',
                bar2='there',
                other='nix',
            ),
        ))
        self.assertEqual(result, [
            {'short': True, 'title': 'foo', 'value': 'YOLO'},
            {'short': True, 'title': 'bar1', 'value': 'hi'},
            {'short': True, 'title': 'bar2', 'value': 'there'},
        ])

    def test_format_template(t):
        t.assertEqual(
            format_template('test_key', dict(search_name="my search", configuration=dict(test_key="TMPL {search_name}"))),
            'TMPL my search'
        )
        t.assertEqual(
            format_template('test_key', dict(search_name="my search", configuration=dict(test_key="TMPL {missing_key}"))),
            'TMPL {missing_key}'
        )
        t.assertEqual(
            format_template('test_key', dict(search_name="my search", configuration=dict(test_key="TMPL {invalid key}"))),
            'TMPL {invalid key}'
        )
        t.assertEqual(
            format_template('test_key', dict(search_name="my search", configuration=dict(test_key="TMPL {invalid!key}"))),
            'TMPL {invalid!key}'
        )
        t.assertEqual(
            format_template('test_key_nx', dict(search_name="my search", configuration=dict(test_key="TMPL {search_name}"))),
            ''
        )

if __name__ == '__main__':
    unittest.main()
