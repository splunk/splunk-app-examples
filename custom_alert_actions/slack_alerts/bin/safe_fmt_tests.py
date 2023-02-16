import unittest
from safe_fmt import safe_format

class TestSafeFmt(unittest.TestCase):
    def test_without_placeholder(t):
        t.assertEqual(
            safe_format('foo'),
            'foo'
        )

    def test_convert_values(t):
        t.assertEqual(safe_format('{foo}', dict(foo="a string")), 'a string')
        t.assertEqual(safe_format('{foo}', dict(foo=4711)), '4711')
        t.assertEqual(safe_format('{foo}', dict(foo=None)), 'None')
        t.assertEqual(safe_format('{foo}', dict(foo=True)), 'True')
        t.assertEqual(safe_format('{foo}', dict(foo=[1,2,3])), '[1, 2, 3]')
        t.assertEqual(safe_format('{foo}', dict(foo=dict(foo='bar'))), '{"foo": "bar"}')

    def test_object_index(t):
        t.assertEqual(
            safe_format('{bar}!', dict(bar="BAR")),
            'BAR!',
        )

    def test_object_index_missing(t):
        t.assertEqual(
            safe_format('{foo}', dict(bar="BAR")),
            '{foo}',
        )

    def test_nested_object(t):
        t.assertEqual(
            safe_format('{foo.bar}', dict(foo=dict(bar="123"))),
            '123',
        )
        t.assertEqual(
            safe_format('{foo[bar]}', dict(foo=dict(bar="456"))),
            '456',
        )
        # t.assertEqual(
        #     safe_format('{foo[0].ding}', dict(foo=[dict(ding='DONG')])),
        #     'DONG'
        # )

    def test_nested_object_missing(t):
        t.assertEqual(
            safe_format('{foo.bar}', dict(foo=dict())),
            '{foo.bar}',
        )
        t.assertEqual(
            safe_format('{foo.bar}', dict()),
            '{foo.bar}',
        )
        t.assertEqual(
            safe_format('{foo[bar]}', dict()),
            '{foo[bar]}',
        )
        t.assertEqual(
            safe_format('{foo[0].ding}', dict(foo=[dict(x='DONG')])),
            '{foo[0].ding}'
        )
        t.assertEqual(
            safe_format('{foo[0].ding}', dict(foo=[])),
            '{foo[0].ding}'
        )
        t.assertEqual(
            safe_format('{foo[0].ding}', dict()),
            '{foo[0].ding}'
        )

    def test_no_attr_access(t):
        t.assertEqual(
            safe_format('{foo.__class__}', dict(foo="1")),
            '{foo.__class__}'
        )

    def test_empty_placeholder(t):
        t.assertEqual(safe_format('{0}', dict()), '{0}')
        t.assertEqual(safe_format('A {0} B {1}', dict()), 'A {0} B {1}')
        t.assertEqual(safe_format('A {0} B {x}', dict(x=1)), 'A {0} B 1')

    def test_num_placeholder(t):
        t.assertEqual(safe_format('{0}', dict()), '{0}')
        t.assertEqual(safe_format('{buu.5}', dict(buu=[1,2,3,4,5,6])), '{buu.5}')

if __name__ == '__main__':
    unittest.main()
