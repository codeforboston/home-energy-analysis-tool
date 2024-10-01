import csv
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, Optional, Sequence

from pydantic import Field

from rules_engine.pydantic_models import (
    FuelType,
    NaturalGasBillingInput,
    NaturalGasBillingRecordInput,
    OilPropaneBillingInput,
    OilPropaneBillingRecordInput,
    SummaryInput,
    SummaryOutput,
    TemperatureInput,
)


class Summary(SummaryInput, SummaryOutput):
    """
    Holds summary.json information alongside a string referring to a
    local weather station.
    """

    local_weather_station: str


# Extend NG Billing Record Input to capture whole home heat loss input from example data
class NaturalGasBillingRecordExampleInput(NaturalGasBillingRecordInput):
    """
    whole_home_heat_loss_rate is added to this class solely because of testing needs
    and must be included, and this class must be used instead of NaturalGasBillingRecordInput,
    which would otherwise intuitively be used, and which is used in production.
    """

    whole_home_heat_loss_rate: float
    inclusion_override: Optional[bool] = Field(description="Natural Gas!E")


# Then overload NG Billing Input to contain new NG Billing Record Example Input subclass
class NaturalGasBillingExampleInput(NaturalGasBillingInput):
    """
    This class exists to contain a list of NaturalGasBillingRecordExampleInput, which
    must be used for testing purposes rather than NaturalGasBillingInput, which would
    otherwise intuitively used, and which is used in production.
    """

    records: Sequence[NaturalGasBillingRecordExampleInput]


class OilPropaneBillingRecordExampleInput(OilPropaneBillingRecordInput):
    """
    whole_home_heat_loss_rate is added to this class solely because of testing needs
    and must be included, and this class must be used instead of OilPropaneBillingRecordInput,
    which would otherwise intuitively be used, and which is used in production.
    """

    whole_home_heat_loss_rate: float
    inclusion_override: Optional[bool] = Field(description="Oil-Propane!F")


class OilPropaneBillingExampleInput(OilPropaneBillingInput):
    """
    This class exists to contain a list of OilPropaneBillingRecordExampleInput, which
    must be used for testing purposes rather than OilPropaneBillingInput, which would
    otherwise intuitively used, and which is used in production.
    """

    records: Sequence[OilPropaneBillingRecordExampleInput]


def load_fuel_billing_example_input(
    folder: Path, fuel_type: FuelType, estimated_balance_point: float
) -> NaturalGasBillingExampleInput | OilPropaneBillingExampleInput:
    """
    Loads a NaturalGasBillingExampleInput or
    OilPropaneBillingExampleInput from an appropriate csv.

    Arguments:
        folder - the path to the file
        fuel_type - GAS or OIL, the latter of which refers to propane
                    too
        estimated_balance_point - TODO: Document what this argument is.
    """

    file_name = None
    match fuel_type:
        case FuelType.GAS:
            file_name = "natural-gas.csv"
        case FuelType.OIL | FuelType.PROPANE:
            file_name = "oil-propane.csv"
        case _:
            raise ValueError("Unsupported fuel type.")

    records: list[Any] = []
    with open(folder / file_name) as f:
        reader = csv.DictReader(f)
        row: Any
        for i, row in enumerate(reader):
            inclusion_override = bool(row["inclusion_override"])

            # Choose the correct billing period heat loss (aka "ua")
            # column based on the estimated balance point provided in
            # SummaryOutput
            ua_column_name = None
            # First we will look for an exact match to the value of
            # the estimated balance point
            for column_name in row:
                if (
                    "ua_at_" in column_name
                    and str(estimated_balance_point) in column_name
                ):
                    ua_column_name = column_name
                    break
            # If we don't find that exact match, we round the balance
            # point up to find our match.
            # It's possible that with further updates to summary data
            # in xls and regen csv files, we wouldn't have this case.
            if ua_column_name == None:
                ua_column_name = (
                    "ua_at_" + str(int(round(estimated_balance_point, 0))) + "f"
                )
            ua = (
                row[ua_column_name].replace(",", "").strip()
            )  # Remove commas and whitespace to cleanup the data
            if bool(ua):
                whole_home_heat_loss_rate = float(ua)
            else:
                whole_home_heat_loss_rate = 0

            if fuel_type == FuelType.GAS:
                natural_gas_item = NaturalGasBillingRecordExampleInput(
                    period_start_date=_parse_date(row["start_date"]),
                    period_end_date=_parse_date(row["end_date"]),
                    usage_therms=row["usage"],
                    inclusion_override=inclusion_override,
                    whole_home_heat_loss_rate=whole_home_heat_loss_rate,
                )
                records.append(natural_gas_item)
            elif fuel_type == FuelType.OIL:
                if i == 0:
                    preceding_delivery_date = _parse_date(
                        row["start_date"]
                    ) - timedelta(days=1)

                oil_propane_item = OilPropaneBillingRecordExampleInput(
                    period_end_date=_parse_date(row["end_date"]),
                    gallons=row["usage"],
                    inclusion_override=inclusion_override,
                    whole_home_heat_loss_rate=whole_home_heat_loss_rate,
                )
                records.append(oil_propane_item)
            else:
                raise ValueError("Unsupported fuel type.")

        if fuel_type == FuelType.GAS:
            return NaturalGasBillingExampleInput(records=records)
        elif fuel_type == FuelType.OIL:
            return OilPropaneBillingExampleInput(
                records=records, preceding_delivery_date=preceding_delivery_date
            )
        else:
            raise ValueError("Unsupported fuel type.")


def _parse_date(value: str) -> date:
    return datetime.strptime(value.split(maxsplit=1)[0], "%Y-%m-%d").date()


def load_temperature_data(path: Path, weather_station: str) -> TemperatureInput:
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        dates = []
        temperatures = []

        row: Any
        for row in reader:
            dates.append(datetime.strptime(row["Date"], "%Y-%m-%d").date())
            temperatures.append(row[weather_station])

    return TemperatureInput(dates=dates, temperatures=temperatures)
