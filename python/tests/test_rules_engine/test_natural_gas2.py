import csv
import json
import os
import pathlib
from datetime import datetime
from typing import Any

import pytest
from pydantic import BaseModel
from pytest import approx

from rules_engine import engine
from rules_engine.pydantic_models import FuelType, TemperatureInput

from .test_utils import (
    NaturalGasBillingExampleInput,
    Summary,
    load_fuel_billing_example_input,
    load_temperature_data,
)

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
NATURAL_GAS_DIR = ROOT_DIR / "ethan"

# TODO: example-2 is OIL; all others are Natural Gas
YET_TO_BE_UPDATED_EXAMPLES = "example-2"

# Filter out failing examples for now
INPUT_DATA = filter(
    lambda d: d not in YET_TO_BE_UPDATED_EXAMPLES, next(os.walk(NATURAL_GAS_DIR))[1]
)


class Example(BaseModel):
    summary: Summary
    natural_gas_usage: NaturalGasBillingExampleInput
    temperature_data: TemperatureInput


def load_summary(folder: str) -> Summary:
    with open(NATURAL_GAS_DIR / folder / "summary.json") as f:
        d = json.load(f)
        return Summary(**d)


@pytest.fixture(scope="module", params=INPUT_DATA)
def data(request):
    """
    Loads the usage and temperature data and summary inputs into an
    Example instance.
    """
    summary = load_summary(request.param)

    if summary.fuel_type == FuelType.GAS:
        natural_gas_usage = load_fuel_billing_example_input(
            NATURAL_GAS_DIR / request.param,
            FuelType.GAS,
            summary.estimated_balance_point,
        )
    else:
        natural_gas_usage = None

    weather_station_short_name = summary.local_weather_station[:4]
    temperature_data = load_temperature_data(
        ROOT_DIR / "temperature-data.csv", weather_station_short_name
    )

    example = Example(
        summary=summary,
        natural_gas_usage=natural_gas_usage,
        temperature_data=temperature_data,
    )
    yield example


def test_average_indoor_temp(data: Example) -> None:
    # Print input variables (excluding billing records)
    print(f"thermostat_set_point: {data.summary.thermostat_set_point}")
    print(f"setback_temperature: {data.summary.setback_temperature}")
    print(f"setback_hours_per_day: {data.summary.setback_hours_per_day}")
    print(f"fuel_type: {data.summary.fuel_type}")
    print(f"heating_system_efficiency: {data.summary.heating_system_efficiency}")
    print(f"design_temperature: {data.summary.design_temperature}")
    print(
        f"estimated_water_heating_efficiency: {getattr(data.summary, 'estimated_water_heating_efficiency', None)}"
    )
    print(f"stand_by_losses: {getattr(data.summary, 'stand_by_losses', None)}")

    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )

    hlo = rules_engine_result.heat_load_output
    print(f"estimated_balance_point: {hlo.estimated_balance_point}")
    print(f"other_fuel_usage: {hlo.other_fuel_usage}")
    print(f"average_indoor_temperature: {hlo.average_indoor_temperature}")
    print(f"difference_between_ti_and_tbp: {hlo.difference_between_ti_and_tbp}")
    print(f"design_temperature: {hlo.design_temperature}")
    print(f"whole_home_heat_loss_rate: {hlo.whole_home_heat_loss_rate}")
    print(
        f"standard_deviation_of_heat_loss_rate: {hlo.standard_deviation_of_heat_loss_rate}"
    )
    print(f"average_heat_load: {hlo.average_heat_load}")
    print(f"maximum_heat_load: {hlo.maximum_heat_load}")
    assert True
