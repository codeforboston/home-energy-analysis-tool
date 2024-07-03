from pydantic import BaseModel

import NaturalGasBillingExampleInput
import OilPropaneBillingExampleInput


class Summary(SummaryInput, SummaryOutput):
    """
    Holds summary.json information alongside a string referring to a
    local weather station.
    """
    local_weather_station: str


def load_fuel_billing_example_input(
    folder: str, fuel_type: str, estimated_balance_point: float
) -> NaturalGasBillingExampleInput | OilPropaneBillingExampleInput:
    """
    Loads a NaturalGasBillingExampleInput or 
    OilPropaneBillingExampleInput from an appropriate csv.

    Arguments:
        folder - the string path to the file
        fuel_type - GAS or OIL, the latter of which refers to propane
                    too
        estimated_balance_point - TODO: Document what this argument is.
    """
    records = []

    with open(folder / fuel_type) as f:
        reader = csv.DictReader(f)
        row: Any
        for row in reader:
            inclusion_override = row["inclusion_override"]
            if inclusion_override == "":
                inclusion_override = None
            else:
                inclusion_override = int(inclusion_override)

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

            item = NaturalGasBillingRecordExampleInput(
                period_start_date=datetime.strptime(
                    row["start_date"].split(maxsplit=1)[0], "%Y-%m-%d"
                ).date(),
                period_end_date=datetime.strptime(
                    row["end_date"].split(maxsplit=1)[0], "%Y-%m-%d"
                ).date(),
                usage_therms=row["usage"],
                inclusion_override=inclusion_override,
                whole_home_heat_loss_rate=whole_home_heat_loss_rate,
            )
            records.append(item)

    return (NaturalGasBillingExampleInput(records=records)
            if fuel_type == "GAS"
            else OilPropaneBillingExample(records=records))
