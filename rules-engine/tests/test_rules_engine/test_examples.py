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
    SummaryInput,
    SummaryOutput,
    TemperatureInput,
)

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"

# Filter out example 2 for now, since it's for oil fuel type
# INPUT_DATA = filter(lambda d: d != "example-2", next(os.walk(ROOT_DIR))[1])
# Filter out all but the first example, breslow, as that is the only one that has UA values added to the CSV so far, for 68 degree balance point example
INPUT_DATA = filter(lambda d: d == "breslow", next(os.walk(ROOT_DIR))[1])
# INPUT_DATA = filter(lambda d: d == "cali", next(os.walk(ROOT_DIR))[1])


# Extend NG Billing Record Input to capture whole home heat loss input from example data
class NaturalGasBillingRecordExampleInput(NaturalGasBillingRecordInput):
    whole_home_heat_loss_rate: float


# Overload input to capture whole home heat loss input from example data
class NaturalGasBillingExampleInput(NaturalGasBillingInput):
    records: List[NaturalGasBillingRecordExampleInput]


class Summary(SummaryInput, SummaryOutput):
    local_weather_station: str


class Example(BaseModel):
    summary: Summary
    natural_gas_usage: NaturalGasBillingExampleInput
    temperature_data: TemperatureInput


def load_summary(folder: str) -> Summary:
    with open(ROOT_DIR / folder / "summary.json") as f:
        d = json.load(f)
        return Summary(**d)


def load_natural_gas(folder: str) -> NaturalGasBillingExampleInput:
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
            ua = row["ua"]
            if ua == "":
                whole_home_heat_loss_rate = float(0)
            else:
                whole_home_heat_loss_rate = float(ua)

            item = NaturalGasBillingRecordExampleInput(
                period_start_date=datetime.strptime(
                    row["start_date"], "%m/%d/%Y"
                ).date(),
                period_end_date=datetime.strptime(row["end_date"], "%m/%d/%Y").date(),
                usage_therms=row["usage"],
                inclusion_override=inclusion_override,
                whole_home_heat_loss_rate=whole_home_heat_loss_rate,
            )

            records.append(item)

    return NaturalGasBillingExampleInput(records=records)


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
    avg_indoor_temp = engine.get_average_indoor_temperature(
        data.summary.thermostat_set_point,
        data.summary.setback_temperature or 0,
        data.summary.setback_hours_per_day or 0,
    )
    assert data.summary.average_indoor_temperature == approx(avg_indoor_temp, rel=0.01)


def test_balance_point_natural_gas(data: Example) -> None:
    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert data.summary.estimated_balance_point == approx(
        rules_engine_result.summary_output.estimated_balance_point, abs=0.1
    )


def test_whole_home_heat_loss_rate_natural_gas(data: Example) -> None:
    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert rules_engine_result.summary_output.whole_home_heat_loss_rate == approx(
        data.summary.whole_home_heat_loss_rate, abs=1
    )


def test_standard_deviation_of_heat_loss_rate_natural_gas(data: Example) -> None:
    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert (
        rules_engine_result.summary_output.standard_deviation_of_heat_loss_rate
        == approx(data.summary.standard_deviation_of_heat_loss_rate, abs=0.01)
    )


def test_difference_between_ti_and_tbp_natural_gas(data: Example) -> None:
    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert rules_engine_result.summary_output.difference_between_ti_and_tbp == approx(
        data.summary.difference_between_ti_and_tbp, abs=0.1
    )


def test_average_heat_load_natural_gas(data: Example) -> None:
    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert rules_engine_result.summary_output.average_heat_load == approx(
        data.summary.average_heat_load, abs=1
    )


def test_design_temperature_natural_gas(data: Example) -> None:
    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert rules_engine_result.summary_output.design_temperature == approx(
        data.summary.design_temperature, abs=0.1
    )


def test_maximum_heat_load_natural_gas(data: Example) -> None:
    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )
    assert rules_engine_result.summary_output.maximum_heat_load == approx(
        data.summary.maximum_heat_load, abs=1
    )


def test_billing_records_whole_home_heat_loss_rate(data: Example) -> None:
    rules_engine_result = engine.get_outputs_natural_gas(
        data.summary, data.temperature_data, data.natural_gas_usage
    )

    data_iter = iter(data.natural_gas_usage.records)
    for result in rules_engine_result.billing_records:
        example = next(data_iter)
        whole_home_heat_loss_rate = (
            example.whole_home_heat_loss_rate
            if example.whole_home_heat_loss_rate
            else None
        )
        assert result.whole_home_heat_loss_rate == approx(
            whole_home_heat_loss_rate, abs=0.1
        )
