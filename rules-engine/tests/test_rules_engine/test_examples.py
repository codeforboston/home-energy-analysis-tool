"""
End-to-end unit tests based on a series of examples provided by
the HeatSmart alliance

The rules engine replicates an Excel workbook that helps users estimate
the size of a heat pump for their house; these tests replicate workbook 
examples to verify that the rules engine yields the same results as the 
workbook does.
"""
import csv
import json
import os
import pathlib
from datetime import date, datetime, timedelta
from typing import Any, List, Literal, Optional

import pytest
from pydantic import BaseModel
from pytest import approx
from typing_extensions import Annotated

from rules_engine import engine
from rules_engine.pydantic_models import (
    NaturalGasBillingInput,
    NaturalGasBillingRecordInput,
    OilPropaneBillingInput,
    OilPropaneBillingRecordInput,
    SummaryInput,
    SummaryOutput,
    TemperatureInput,
)

# Test inputs are provided as separate directory within the 
#"cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which
# specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"

INPUT_DATA = next(os.walk(ROOT_DIR))[1]


class Summary(SummaryInput, SummaryOutput):
    local_weather_station: str


class Example(BaseModel):
    summary: Summary
    temperature_data: TemperatureInput
    natural_gas_usage: Optional[NaturalGasBillingInput] = None
    oil_propane_usage: Optional[OilPropaneBillingInput] = None


def load_summary(folder: str) -> Summary:
    with open(ROOT_DIR / folder / "summary.json") as f:
        d = json.load(f)
        return Summary(**d)


def load_natural_gas(folder: str) -> NaturalGasBillingInput:
    """
    Returns a NaturalGasBillingInput data structure given a directory
    enclosing a .csv file of natural gas billing information.

    folder - name of the directory with the .csv file inside
    """
    records = []

    with open(ROOT_DIR / folder / "natural-gas.csv") as f:
        reader = csv.DictReader(f)
        row: Any
        for row in reader:
            inclusion_override = row["inclusion_override"]
            if inclusion_override == "":
                inclusion_override = None
            else:
                inclusion_override = int(inclusion_override)

            item = NaturalGasBillingRecordInput(
                period_start_date=datetime.strptime(
                    row["start_date"], "%m/%d/%Y"
                ).date(),
                period_end_date=datetime.strptime(row["end_date"], "%m/%d/%Y").date(),
                usage_therms=row["usage"],
                inclusion_override=inclusion_override,
            )
            records.append(item)

    return NaturalGasBillingInput(records=records)


def load_oil_propane(folder: str) -> OilPropaneBillingInput:
    """
    Returns a OilPropaneBillingInput data structure given a directory
    enclosing a .csv file of natural gas billing information.


    folder - name of the directory with the .csv file inside
    """
    records = []

    with open(ROOT_DIR / folder / "oil-propane.csv") as f:
        reader = iter(csv.DictReader(f))
        row: Any

        first_row = next(reader)
        preceding_delivery_date = datetime.strptime(
            first_row["date"], "%m/%d/%Y"
        ).date()

        for row in reader:
            inclusion_override = row["inclusion_override"]
            if inclusion_override == "":
                inclusion_override = None
            else:
                inclusion_override = int(inclusion_override)

            period_end_date=datetime.strptime(
                row["date"], "%m/%d/%Y"
            ).date()
            gallons=row["gallons"]

            item = OilPropaneBillingRecordInput(period_end_date=period_end_date, gallons=gallons, inclusion_override=inclusion_override)
            records.append(item)
    return OilPropaneBillingInput(records=records, preceding_delivery_date=preceding_delivery_date)


def load_temperature_data(weather_station: str) -> TemperatureInput:
    with open(ROOT_DIR / "temperature-data.csv", encoding="utf-8-sig") as f:

        reader = csv.DictReader(f)
        dates = []
        temperatures = []

        row: Any
        for row in reader:
            dates.append(datetime.strptime(row["Date"], "%Y-%m-%d").date())
            temperatures.append(row[weather_station])

    return TemperatureInput(dates=dates, temperatures=temperatures)


@pytest.fixture(scope="module", params=INPUT_DATA)
def data(request):
    summary = load_summary(request.param)

    natural_gas_usage = None
    oil_propane_usage = None
    if summary.fuel_type == engine.FuelType.GAS:
        natural_gas_usage = load_natural_gas(request.param)
    else:
        oil_propane_usage = load_oil_propane(request.param)

    weather_station_short_name = summary.local_weather_station[:4]
    temperature_data = load_temperature_data(weather_station_short_name)

    example = Example(
        summary=summary,
        temperature_data=temperature_data,
        natural_gas_usage=natural_gas_usage,
        oil_propane_usage=oil_propane_usage,
    )
    yield example


def test_average_indoor_temp(data: Example) -> None:
    avg_indoor_temp = engine.get_average_indoor_temperature(
        data.summary.thermostat_set_point,
        data.summary.setback_temperature or 0,
        data.summary.setback_hours_per_day or 0,
    )
    assert data.summary.average_indoor_temperature == approx(avg_indoor_temp, rel=0.01)


def test_balance_point_natural_gas(data: Example) -> None:
    summary_output = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert data.summary.estimated_balance_point == approx(
        summary_output.estimated_balance_point, abs=0.1
    )


def test_whole_home_heat_loss_rate_natural_gas(data: Example) -> None:
    summary_output = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert summary_output.whole_home_heat_loss_rate == approx(
        data.summary.whole_home_heat_loss_rate, abs=1
    )


def test_standard_deviation_of_heat_loss_rate_natural_gas(data: Example) -> None:
    summary_output = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert summary_output.standard_deviation_of_heat_loss_rate == approx(
        data.summary.standard_deviation_of_heat_loss_rate, abs=0.01
    )


def test_difference_between_ti_and_tbp_natural_gas(data: Example) -> None:
    summary_output = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert summary_output.difference_between_ti_and_tbp == approx(
        data.summary.difference_between_ti_and_tbp, abs=0.1
    )


def test_average_heat_load_natural_gas(data: Example) -> None:
    summary_output = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert summary_output.average_heat_load == approx(
        data.summary.average_heat_load, abs=1
    )


def test_design_temperature_natural_gas(data: Example) -> None:
    summary_output = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert summary_output.design_temperature == approx(
        data.summary.design_temperature, abs=0.1
    )


def test_maximum_heat_load_natural_gas(data: Example) -> None:
    summary_output = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert summary_output.maximum_heat_load == approx(
        data.summary.maximum_heat_load, abs=1
    )

def test_other_fuel_usage_natural_gas(data: Example) -> None:
    summary_output = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert summary_output.other_fuel_usage == approx(
        data.summary.other_fuel_usage, abs=0.01
    )
