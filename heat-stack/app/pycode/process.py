import json
from datetime import date

import js
from pyodide.code import run_js
from pyodide.ffi import JsProxy, to_js
from rules_engine import engine
from rules_engine.pydantic_models import (
    AnalysisType,
    BalancePointGraph,
    BalancePointGraphRow,
    Constants,
    DhwInput,
    FuelType,
    HeatLoadInput,
    HeatLoadOutput,
    NaturalGasBillingInput,
    NormalizedBillingPeriodRecordInput,
    OilPropaneBillingInput,
    TemperatureInput,
)


def default_converter(value, _i1m, _i2):
    # print("value: "+str(value))
    if "Date" == str(value.constructor.name):
        return date.fromtimestamp(value.valueOf() / 1000)
    return value


def process(s, n, t, b):
    print("S INIT: ")
    print(type(s))

    s = s.as_object_map()
    sv = s.values()
    svm = sv._mapping

    t = t.to_py(default_converter=default_converter)

    summa_inpoot = HeatLoadInput(**svm)
    tempinz = TemperatureInput(**t)

    b = json.loads(b)
    billy_normz = []
    for x in b:
        print(x)
        billy_normz.append(NormalizedBillingPeriodRecordInput(**x))

    print(type(summa_inpoot))
    print(type(tempinz))
    print(type(billy_normz))
    print(summa_inpoot)
    print(tempinz)
    print(billy_normz)

    r = engine.get_outputs_normalized(summa_inpoot, None, tempinz, billy_normz)
    print(r)
    return r
