from rules_engine.pydantic_models import HeatLoadInput
from pyodide.ffi import to_js
import js

def get_py_imp_obj(class_name):
    """Create a Python class object from its name"""
    if class_name == "HeatLoadInput":
        from rules_engine.pydantic_models import HeatLoadInput
        return HeatLoadInput
    # Add other class imports as needed
    return None

def make_si(s):
    """Create a HeatLoadInput from a JS object"""
    return HeatLoadInput(**s)

def get_sio():
    """Get the HeatLoadInput class"""
    from rules_engine.pydantic_models import HeatLoadInput
    return HeatLoadInput