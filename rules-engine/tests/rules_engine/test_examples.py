import csv
import json
import os
import pathlib
from dataclasses import dataclass
from datetime import datetime
from typing import List, Literal, Optional

import pytest
from pytest import approx

from rules_engine import engine

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
INPUT_DATA = next(os.walk(ROOT_DIR))[1]


@dataclass
class Summary:
    local_weather_station: str
    design_temperature_override: Optional[float]
    living_area: int
    fuel_type: engine.FuelType
    heating_system_efficiency: float
    other_fuel_usage: float
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


@dataclass
class NaturalGasUsage:
    start_date: datetime
    end_date: datetime
    days_in_bill: int
    usage: int
    inclusion_override: Literal[-1, 0, 1]
    inclusion_code: Literal[-1, 0, 1]
    avg_daily_usage: float
    daily_htg_usage: float


@dataclass
class Example:
    summary: Summary
    natural_gas_usage: List[NaturalGasUsage]


def load_summary(folder: str) -> Summary:
    with open(ROOT_DIR / folder / "summary.json") as f:
        d = json.load(f)
        return Summary(**d)


def load_natural_gas(folder: str) -> List[NaturalGasUsage]:
    result = []

    with open(ROOT_DIR / folder / "natural-gas.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
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
