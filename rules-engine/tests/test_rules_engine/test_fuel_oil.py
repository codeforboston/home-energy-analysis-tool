"""
Tests for fuel-oil related methods.
"""

import json
import os
import pathlib

import pytest
from pydantic import BaseModel

from rules_engine import engine
from rules_engine.pydantic_models import FuelType, TemperatureInput

from .test_utils import (
    OilPropaneBillingExampleInput,
    Summary,
    load_fuel_billing_example_input,
    load_temperature_data,
)

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
FUEL_OIL_DIR = ROOT_DIR / "fuel_oil"

INPUT_DATA = next(os.walk(FUEL_OIL_DIR))[1]


class Example(BaseModel):
    summary: Summary
    fuel_oil_usage: OilPropaneBillingExampleInput
    temperature_data: TemperatureInput


@pytest.fixture(scope="module", params=INPUT_DATA)
def data(request):
    """
    Loads the usage and temperature data and summary inputs into an
    Example instance.
    """
    summary = load_summary(request.param)

    if summary.fuel_type == FuelType.OIL:
        fuel_oil_usage = load_fuel_billing_example_input(
            FUEL_OIL_DIR / request.param, FuelType.OIL, summary.estimated_balance_point
        )
    else:
        fuel_oil_usage = None

    weather_station_short_name = summary.local_weather_station[:4]
    temperature_data = load_temperature_data(
        ROOT_DIR / "temperature-data.csv", weather_station_short_name
    )

    example = Example(
        summary=summary,
        fuel_oil_usage=fuel_oil_usage,
        temperature_data=temperature_data,
    )
    yield example


def load_summary(folder: str) -> Summary:
    with open(FUEL_OIL_DIR / folder / "summary.json") as fh:
        data = json.load(fh)
        return Summary(**data)


def test_get_outputs_oil_propane(data: Example):
    rezzy = engine.get_outputs_oil_propane(
        data.summary,
        None,
        data.temperature_data,
        data.fuel_oil_usage,
    )
    # assert rezzy things here
    # assert rezzy things here
