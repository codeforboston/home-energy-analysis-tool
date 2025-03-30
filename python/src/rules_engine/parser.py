"""
Return lists of gas billing data parsed from Eversource and
National Grid CSVs.
"""

import csv
import io
import re
from datetime import datetime, timedelta
from enum import StrEnum

from .pydantic_models import NaturalGasBillingInput, NaturalGasBillingRecordInput


class NaturalGasCompany(StrEnum):
    EVERSOURCE = "eversource"
    NATIONAL_GRID = "national_grid"


class _NaturalGasCompanyBillRegex:
    """
    The regex for which to search a natural gas bill to determine its company.
    """

    EVERSOURCE = re.compile(
        r"Read Date,Usage,Number of Days,Usage per day,Charge,Average Temperature"
    )
    NATIONAL_GRID = re.compile(
        r"Name,.*,,,,,\nAddress,.*,,,,,\nAccount Number,.*,,,,,\nService,.*,,,,,\n"
    )


class _GasBillRowEversource:
    """
    Holds data for one row of an Eversource gas bill CSV.

    The names of the fields correspond to the first row of the Eversource bill.

    Example:
        Read Date,Usage,Number of Days,Usage per day,Charge,Average Temperature
        1/18/2022,184.00,32,5.75,$327.58,30.0
        ...
    """

    def __init__(self, row):
        self.read_date = row["Read Date"]
        self.usage = row["Usage"]
        self.number_of_days = row["Number of Days"]


class _GasBillRowNationalGrid:
    """
    Holds data for one row of an National Grid gas bill CSV.

    The names of the fields correspond to the row of the National Grid
    bill right before the billing data.

    Example:
        Name,FIRST LAST,,,,,
        Address,"100 PLACE AVE, BOSTON MA 02130",,,,,
        Account Number,1111111111,,,,,
        Service,Service 1,,,,,
        ,,,,,,
        TYPE,START DATE,END DATE,USAGE,UNITS,COST,NOTES
        Natural gas billing,12/29/2012,1/24/2013,149,therms,$206.91 ,
        ...
    """

    def __init__(self, row):
        self.start_date = row["START DATE"]
        self.end_date = row["END DATE"]
        self.usage = row["USAGE"]


def _newline_line_ending(data: str) -> str:
    """
    Returns a csv with every line ending in a single newline
    character.

    Each Bill CSVs row ends variously, in a newline, carriage
    return, and even a carriage return followed by a newline.
    The company detection and parsing code crash unless each
    row ends in one newline and nothing else.
    """
    data = data.replace("\r", "\n")
    # replaces any number of consecutive newlines with one newline
    regex = re.compile(r"\n+")
    data = re.sub(regex, "\n", data)
    return data


def _detect_gas_company(data: str) -> NaturalGasCompany:
    """
    Return which natural gas company issued this bill.
    """
    if _NaturalGasCompanyBillRegex.NATIONAL_GRID.search(data):
        return NaturalGasCompany.NATIONAL_GRID
    elif _NaturalGasCompanyBillRegex.EVERSOURCE.search(data):
        return NaturalGasCompany.EVERSOURCE
    else:
        raise ValueError(
            """Could not detect which company this bill was from:\n 
                           Regular expressions matched not."""
        )


def parse_gas_bill(
    data: str, company: NaturalGasCompany | None = None
) -> NaturalGasBillingInput:
    """
    Parse a natural gas bill from a given natural gas company.

    Tries to automatically detect the company that sent the bill.
    Otherwise, requires the company be passed as an argument.
    """
    data = _newline_line_ending(data)

    if company == None:
        company = _detect_gas_company(data)

    match company:
        case NaturalGasCompany.EVERSOURCE:
            return _parse_gas_bill_eversource(data)
        case NaturalGasCompany.NATIONAL_GRID:
            return _parse_gas_bill_national_grid(data)
        case _:
            raise ValueError("Wrong CSV format selected: select another format.")


def _get_date_from_string(date_string):
    """
    Returns the date from a string of characters

    Uses a regular expression to check for four digits in a row at
    the beginning of the date string to determine if it starts with the
    year and then tells datetime.strptime the appropriate formatting
    whereby to evaluate the date string, returning the result of that
    function call
    """
    date_string = date_string.replace("-", "/")
    starts_with_four_digits = bool(re.match(r"^\d{4}", date_string))
    if starts_with_four_digits:
        return datetime.strptime(date_string, "%Y/%m/%d")
    else:
        return datetime.strptime(date_string, "%m/%d/%Y")


def _parse_gas_bill_eversource(data: str) -> NaturalGasBillingInput:
    """
    Return a list of gas bill data parsed from an Eversource CSV
    received as a string.

    Example 1:
        Read Date,Usage,Number of Days,Usage per day,Charge,Average Temperature
        1/18/2022,184.00,32,5.75,$327.58,30.0
        ...

    Example 2:
        Read Date,Usage,Number of Days,Usage per day,Charge,Average Temperature
        2022-18-1,184.00,32,5.75,$327.58,30.0
    """
    f = io.StringIO(data)
    reader = csv.DictReader(f)
    records = []
    for row in reader:
        parsed_row = _GasBillRowEversource(row)
        period_end_date = _get_date_from_string(parsed_row.read_date)
        # Calculate period_start_date using the end date and number of days in the bill
        # Care should be taken here to avoid off-by-one errors
        period_start_date = period_end_date - timedelta(
            days=(int(parsed_row.number_of_days) - 1)
        )

        record = NaturalGasBillingRecordInput(
            period_start_date=period_start_date,
            period_end_date=period_end_date,
            usage_therms=parsed_row.usage,
            inclusion_override=None,
        )
        records.append(record)

    return NaturalGasBillingInput(records=records)


def _parse_gas_bill_national_grid(data: str) -> NaturalGasBillingInput:
    """
    Return a list of gas bill data parsed from an National Grid CSV
    received as a string.

    Example:
        Name,FIRST LAST,,,,,
        Address,"100 PLACE AVE, BOSTON MA 02130",,,,,
        Account Number,1111111111,,,,,
        Service,Service 1,,,,,
        ,,,,,,
        TYPE,START DATE,END DATE,USAGE,UNITS,COST,NOTES
        Natural gas billing,12/29/2012,1/24/2013,149,therms,$206.91 ,
        ...
    """
    f = io.StringIO(data)
    ROWS_TO_SKIP = 5
    for _ in range(ROWS_TO_SKIP):
        next(f)
    reader = csv.DictReader(f)

    records = []
    for row in reader:
        parsed_row = _GasBillRowNationalGrid(row)

        period_start_date = _get_date_from_string(parsed_row.start_date)
        period_end_date = _get_date_from_string(parsed_row.end_date)

        record = NaturalGasBillingRecordInput(
            period_start_date=period_start_date,
            period_end_date=period_end_date,
            usage_therms=parsed_row.usage,
            inclusion_override=None,
        )
        records.append(record)

    return NaturalGasBillingInput(records=records)
