"""
Tests for fuel-oil related methods.
"""
import pathlib
import csv

from pydantic import BaseModel

from test_utils import Summary

from rules_engine.pydantic_models import (
    OilPropaneBillingRecordInput,
    OilPropaneBillingInput
)

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
FUEL_OIL_DIR = ROOT_DIR / "fuel_oil"

class Example(BaseModel):
    summary: Summary
    fuel_oil_usage: OilPropaneBillingExampleInput
    temperature_data: TemperatureInput

class OilPropaneBillingRecordExampleInput(OilPropaneBillingInput):
    records: list[OilPropaneBillingRecordInput]

@pytest.fixture(scope="module", params=INPUT_DATA)
def data(request):
    """
    Loads the usage and temperature data and summary inputs into an 
    Example instance.
    """
    summary = load_summary(request.param)

    if summary.fuel_type == engine.FuelType.OIL:
        fuel_oil_usage = load_fuel_oil(
            request.param, summary.estimated_balance_point
        )
    else:
        fuel_oil_usage = None

    weather_station_short_name = summary.local_weather_station[:4]
    temperature_data = load_temperature_data(weather_station_short_name)

    example = Example(
        summary=summary,
        fuel_oil_usage=fuel_oil_usage,
        temperature_data=temperature_data,
    )
    yield example