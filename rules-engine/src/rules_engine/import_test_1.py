"""
TODO: this module was created to test importing via Pyodide.
Once that testing is complete, this module should be deleted.
"""

from . import import_test_2

def try_it_out() -> bool:
    foo = import_test_2.Foo()
    foo.call_me()
    return True