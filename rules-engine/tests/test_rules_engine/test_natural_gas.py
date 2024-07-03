import csv
import json
import os
import pathlib
from datetime import date, datetime, timedelta
from typing import Any, Literal, Optional

import pytest
from pydantic import BaseModel
from pytest import approx
from typing_extensions import Annotated

from test_utils import Summary

from rules_engine import engine
from rules_engine.pydantic_models import (
    NaturalGasBillingInput,
    NaturalGasBillingRecordInput,
    SummaryInput,
    SummaryOutput,
    TemperatureInput,
)

from test_utils import load_fuel_billing_example_input

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
NATURAL_GAS_DIR = ROOT_DIR / "natural_gas"

# TODO: example-2 is OIL; shen is misbehaving
YET_TO_BE_UPDATED_EXAMPLES = ("example-2", "shen")
# Filter out failing examples for now
INPUT_DATA = filter(
    lambda d: d not in YET_TO_BE_UPDATED_EXAMPLES, next(os.walk(NATURAL_GAS_DIR))[1]
)


class Summary(SummaryInput, SummaryOutput):
    local_weather_station: str


# Extend NG Billing Record Input to capture whole home heat loss input from example data
class NaturalGasBillingRecordExampleInput(NaturalGasBillingRecordInput):
    """
    whole_home_heat_loss_rate is added to this class solely because of testing needs
    and must be included, and this class must be used instead of NaturalGasBillingRecordInput,
    which would otherwise intuitively be used, and which is used in production.
    """
    whole_home_heat_loss_rate: float


# Then overload NG Billing Input to contain new NG Billing Record Example Input subclass
class NaturalGasBillingExampleInput(NaturalGasBillingInput):
    """
    This class exists to contain a list of NaturalGasBillingRecordExampleInput, which
    must be used for testing purposes rather than NaturalGasBillingInput, which would
    otherwise intuitively used, and which is used in production.
    """
    records: list[NaturalGasBillingRecordExampleInput]


class Example(BaseModel):
    summary: Summary
    natural_gas_usage: NaturalGasBillingExampleInput
    temperature_data: TemperatureInput


def load_summary(folder: str) -> Summary:
    with open(NATURAL_GAS_DIR / folder / "summary.json") as f:
        d = json.load(f)
        return Summary(**d)


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
    """
    Loads the usage and temperature data and summary inputs into an
    Example instance.
    """
    summary = load_summary(request.param)

    if summary.fuel_type == engine.FuelType.GAS:
        natural_gas_usage = load_fuel_billing_example_input(
            request.param, "GAS", summary.estimated_balance_point
        )
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
