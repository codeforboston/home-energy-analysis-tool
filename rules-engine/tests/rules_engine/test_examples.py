import csv
import json
import os
import pathlib
from datetime import datetime
from typing import List, Literal, Optional
from typing_extensions import Annotated

import pytest
from pytest import approx
from pydantic import BaseModel, BeforeValidator

from rules_engine import engine

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
INPUT_DATA = next(os.walk(ROOT_DIR))[1]


def validate_fuel_type(value):
    try:
        return engine.FuelType[value]
    except KeyError as e:
        raise ValueError(f"Error validating fuel type {e}. Valid choices are: {[x.name for x in engine.FuelType]}")


class Summary(BaseModel):
    local_weather_station: str
    design_temperature_override: Optional[float]
    living_area: int
    fuel_type: Annotated[engine.FuelType, BeforeValidator(validate_fuel_type)]
    heating_system_efficiency: float
    other_fuel_usage: Optional[float]
    other_fuel_usage_override: Optional[float]
    thermostat_set_point: float
    setback_temp: float
    setback_hours_per_day: float
    estimated_balance_point: float
    balance_point_sensitivity: float
    average_indoor_temperature: float
    difference_between_ti_and_tbp: float
    design_temperature: float
    whole_home_ua: int
    standard_deviation_of_ua: float
    avg_heat_load: int
    max_heat_load: int


def validate_datetime(value):
    return datetime.strptime(
        value,
        "%m/%d/%Y"
    ).date()


def validate_inclusion(value):
    return int(value) if value else None


class NaturalGasUsage(BaseModel):
    start_date: Annotated[datetime, BeforeValidator(validate_datetime)]
    end_date: Annotated[datetime, BeforeValidator(validate_datetime)]
    days_in_bill: int
    usage: int
    inclusion_override: Annotated[Optional[Literal[-1, 0, 1]], BeforeValidator(validate_inclusion)]
    inclusion_code: Annotated[Literal[-1, 0, 1], BeforeValidator(validate_inclusion)]
    avg_daily_usage: float
    daily_htg_usage: float

        

class Example(BaseModel):
    summary: Summary
    natural_gas_usage: Optional[List[NaturalGasUsage]]


def load_summary(folder: str) -> Summary:
    with open(ROOT_DIR / folder / "summary.json") as f:
        d = json.load(f)
        return Summary(**d)


def load_natural_gas(folder: str) -> List[NaturalGasUsage]:
    result = []

    with open(ROOT_DIR / folder / "natural-gas.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
            print("row:", row)
            item = NaturalGasUsage(**row)
            result.append(item)

    return result


@pytest.fixture(scope="module", params=INPUT_DATA)
def data(request):
    summary = load_summary(request.param)
    if summary.fuel_type == engine.FuelType.GAS:
        natural_gas_usage = load_natural_gas(request.param)
    else:
        natural_gas_usage = None

    example = Example(summary=summary, natural_gas_usage=natural_gas_usage)
    yield example


def test_average_indoor_temp(data: Example) -> None:
    avg_indoor_temp = engine.average_indoor_temp(
        data.summary.thermostat_set_point,
        data.summary.setback_temp,
        data.summary.setback_hours_per_day,
    )
    assert data.summary.average_indoor_temperature == approx(avg_indoor_temp, rel=0.1)
