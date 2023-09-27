import csv
import json
import os
import pathlib
from datetime import date, datetime, timedelta
from typing import List, Literal, Optional

import pytest
from pydantic import BaseModel, BeforeValidator
from pytest import approx
from typing_extensions import Annotated

from rules_engine import engine

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
INPUT_DATA = next(os.walk(ROOT_DIR))[1]


def validate_fuel_type(value):
    try:
        return engine.FuelType[value]
    except KeyError as e:
        raise ValueError(
            f"Error validating fuel type {e}. Valid choices are: {[x.name for x in engine.FuelType]}"
        )


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


def validate_usage_date(value):
    return datetime.strptime(value, "%m/%d/%Y").date()


def validate_inclusion(value):
    return int(value) if value else None


class NaturalGasUsage(BaseModel):
    start_date: Annotated[date, BeforeValidator(validate_usage_date)]
    end_date: Annotated[date, BeforeValidator(validate_usage_date)]
    days_in_bill: int
    usage: int
    inclusion_override: Annotated[
        Optional[Literal[-1, 0, 1]], BeforeValidator(validate_inclusion)
    ]
    inclusion_code: Annotated[Literal[-1, 0, 1], BeforeValidator(validate_inclusion)]
    avg_daily_usage: float
    daily_htg_usage: float


def validate_temperature_date(value):
    return datetime.strptime(value, "%Y-%m-%d").date()


class TemperatureDataRecord(BaseModel):
    date: Annotated[date, BeforeValidator(validate_temperature_date)]
    temperature: float


class Example(BaseModel):
    summary: Summary
    natural_gas_usage: Optional[List[NaturalGasUsage]]
    temperature_data: List[TemperatureDataRecord]


def load_summary(folder: str) -> Summary:
    with open(ROOT_DIR / folder / "summary.json") as f:
        d = json.load(f)
        return Summary(**d)


def load_natural_gas(folder: str) -> List[NaturalGasUsage]:
    result = []

    with open(ROOT_DIR / folder / "natural-gas.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
            item = NaturalGasUsage(**row)  # type: ignore[arg-type]
            result.append(item)

    return result


def load_temperature_data(weather_station: str) -> List[TemperatureDataRecord]:
    result = []

    with open(ROOT_DIR / "temperature-data.csv", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            item = TemperatureDataRecord(
                date=row["Date"], temperature=row[weather_station]  # type: ignore[arg-type]
            )
            result.append(item)

    return result


# @pytest.fixture(scope="module", params=INPUT_DATA)
@pytest.fixture(scope="module", params=["example-1", "example-4"])
def data(request):
    summary = load_summary(request.param)

    if summary.fuel_type == engine.FuelType.GAS:
        natural_gas_usage = load_natural_gas(request.param)
    else:
        natural_gas_usage = None

    weather_station_short_name = summary.local_weather_station[:4]
    temperature_data = load_temperature_data(weather_station_short_name)

    example = Example(
        summary=summary,
        natural_gas_usage=natural_gas_usage,
        temperature_data=temperature_data,
    )
    yield example


def test_average_indoor_temp(data: Example) -> None:
    avg_indoor_temp = engine.average_indoor_temp(
        data.summary.thermostat_set_point,
        data.summary.setback_temp,
        data.summary.setback_hours_per_day,
    )
    assert data.summary.average_indoor_temperature == approx(avg_indoor_temp, rel=0.1)

def test_ua(data: Example) -> None:
    """
    Test how the rules engine calculates UA from energy bills.

    Pulls in data and pre-calculated results from example spreadsheets
    and compares them to the UA calculated from that data by the
    engine.
    """
    # TODO: Handle oil and propane fuel types too
    usage_data = None
    if data.summary.fuel_type is engine.FuelType.GAS:
        usage_data = data.natural_gas_usage
    else:
        raise NotImplementedError('Fuel type {}'.format(data.summary.fuel_type))

    # build Home instance - input summary information and bills
    home = engine.Home(data.summary.fuel_type,
                       data.summary.heating_system_efficiency,
                       thermostat_set_point=data.summary.thermostat_set_point)

    temps = []
    usages = []
    inclusion_codes = []
    for usage in usage_data:
        temps_for_period = []
        for i in range(usage.days_in_bill):
            date_in_period = usage.start_date + timedelta(days=i)
            matching_records = [d for d in data.temperature_data if d.date == date_in_period]
            assert len(matching_records) == 1
            temps_for_period.append(matching_records[0].temperature)
        assert date_in_period == usage.end_date

        inclusion_code = usage.inclusion_code
        if usage.inclusion_override is not None:
            inclusion_code = usage.inclusion_override

        temps.append(temps_for_period)
        usages.append(usage.usage)
        inclusion_codes.append(inclusion_code)

    print(temps)
    print(usages)
    print(inclusion_codes)
    home.initialize_billing_periods(temps, usages, inclusion_codes)

    # now check outputs
    home.calculate_balance_point_and_ua()
    for bp in home.bills_winter:
        print("Avg Heating Usage:", bp.avg_heating_usage)
        print("Partial UA:", bp.partial_ua)
        print("UA:", bp.ua)

    assert home.avg_ua == approx(data.summary.whole_home_ua, abs=1)
    assert home.stdev_pct == approx(data.summary.standard_deviation_of_ua, abs=0.01)
    # TODO: check average heat load and max heat load