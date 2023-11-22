import csv
import json
import os
import pathlib
from datetime import date, datetime, timedelta
from typing import Any, List, Literal, Optional

import pytest
from pydantic import BaseModel
from pytest import approx
from rules_engine import engine
from rules_engine.pydantic_models import (NaturalGasBillingInput,
                                          NaturalGasBillingRecordInput,
                                          SummaryInput, SummaryOutput,
                                          TemperatureInput)
from typing_extensions import Annotated

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
# Filter out example 2 for now, since it's for oil fuel type
INPUT_DATA = filter(lambda d: d != "example-2", next(os.walk(ROOT_DIR))[1])


class Summary(SummaryInput, SummaryOutput):
    local_weather_station: str


class Example(BaseModel):
    summary: Summary
    natural_gas_usage: NaturalGasBillingInput
    temperature_data: TemperatureInput


def load_summary(folder: str) -> Summary:
    with open(ROOT_DIR / folder / "summary.json") as f:
        d = json.load(f)
        return Summary(**d)


def load_natural_gas(folder: str) -> NaturalGasBillingInput:
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


def load_temperature_data(weather_station: str) -> TemperatureInput:
    with open(ROOT_DIR / "temperature-data.csv", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        dates = []
        temperatures = []

        row: Any
        for row in reader:
            dates.append(row["Date"])
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
    avg_indoor_temp = engine.average_indoor_temp(
        data.summary.thermostat_set_point,
        data.summary.setback_temperature or 0,
        data.summary.setback_hours_per_day or 0,
    )
    assert data.summary.average_indoor_temperature == approx(avg_indoor_temp, rel=0.1)


# def test_ua(data: Example) -> None:
#     """
#     Test how the rules engine calculates UA from energy bills.

#     Pulls in data and pre-calculated results from example spreadsheets
#     and compares them to the UA calculated from that data by the
#     engine.
#     """
#     # TODO: Handle oil and propane fuel types too
#     usage_data = None
#     if data.summary.fuel_type is engine.FuelType.GAS:
#         usage_data = data.natural_gas_usage
#     else:
#         raise NotImplementedError("Fuel type {}".format(data.summary.fuel_type))

#     # build Home instance - input summary information and bills
#     home = engine.Home(
#         data.summary,
#         data.summary.fuel_type,
#         data.summary.heating_system_efficiency,
#         thermostat_set_point=data.summary.thermostat_set_point,
#     )
#     temps = []
#     usages = []
#     inclusion_codes = []
#     for usage in usage_data.records:
#         temps_for_period = []
#         for i in range(usage.days_in_bill):
#             date_in_period = usage.start_date + timedelta(days=i)
#             matching_records = [
#                 d for d in data.temperature_data if d.date == date_in_period
#             ]
#             assert len(matching_records) == 1
#             temps_for_period.append(matching_records[0].temperature)
#         assert date_in_period == usage.end_date

#         inclusion_code = usage.inclusion_code
#         if usage.inclusion_override is not None:
#             inclusion_code = usage.inclusion_override

#         temps.append(temps_for_period)
#         usages.append(usage.usage)
#         inclusion_codes.append(inclusion_code)

#     home.initialize_billing_periods(temps, usages, inclusion_codes)

#     # now check outputs
#     home.calculate_balance_point_and_ua(
#         initial_balance_point_sensitivity=data.summary.balance_point_sensitivity
#     )

#     assert home.balance_point == approx(data.summary.estimated_balance_point, abs=0.01)
#     assert home.avg_ua == approx(data.summary.whole_home_heat_loss_rate, abs=1)
#     assert home.stdev_pct == approx(data.summary.standard_deviation_of_heat_loss_rate, abs=0.01)
#     # TODO: check average heat load and max heat load
