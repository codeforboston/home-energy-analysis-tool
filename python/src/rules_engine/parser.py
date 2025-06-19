"""
Return lists of gas billing data parsed from Eversource and
National Grid CSVs.
"""

import csv
import io
import re
from datetime import datetime, timedelta
from enum import StrEnum
from typing import Dict

import rules_engine.constants as constants

from .pydantic_models import NaturalGasBillingInput, NaturalGasBillingRecordInput

_ASCII_CHARACTERS_PLUS_NEWLINE = set(
    " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\n"
)


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
        r"Name,.*\n"  # Match "Name," followed by any characters and a newline
        r"Address,.*\n"  # Match "Address," followed by any characters and a newline
        r"Account Number,.*\n"  # Match "Account Number," followed by any characters and a newline
        r"Service,.*\n"  # Match "Service," followed by any characters and a newline
    )


class _ColumnNamesEversource:
    """
    Column names of an Eversource gas bill.

    "Usage (Therms)" MUST come before "Usage" because the code checks
    if each column name is in the header, and "Usage" is in "Usage (Therms),"
    and therefore the code can mistake a column headed by "Usage (Therms)" for
    one headed by "Usage," causing an error.
    """

    @staticmethod
    def find_column(column_names, header):
        for column_name in column_names:
            if column_name in header:
                return column_name
        raise ValueError(
            "Column not found in header.  Column names tried:", column_names
        )

    def __init__(self, header: str):
        self.read_date = _ColumnNamesEversource.find_column(
            constants.READ_DATE_NAMES_EVERSOURCE, header
        )
        self.number_of_days = _ColumnNamesEversource.find_column(
            constants.NUMBER_OF_DAYS_NAMES_EVERSOURCE, header
        )
        self.usage = _ColumnNamesEversource.find_column(
            constants.USAGE_NAMES_EVERSOURCE, header
        )


class _GasBillRowEversource:
    """
    Holds data for one row of an Eversource gas bill CSV.

    The names of the fields correspond to the first row of the Eversource bill.

    Example from latest CSV:
        Read Date,Usage,Number of Days,Usage per day,Charge,Average Temperature
        1/18/2022,184.00,32,5.75,$327.58,30.0
        ...

    Example from TSV (alternative to CSV):
        End Date	Days In Bill	Meter Read	Read Type	Usage (CCF)	Usage (Therms)	Usage (Cost)
        "7/12/2021"	"32"	"9113"	"ACTUAL"	"18"	"18"	"$30.58"
        ...
    """

    def __init__(self, row: Dict[str, str], column_names: _ColumnNamesEversource):
        self.read_date = row[column_names.read_date]
        self.usage = float(row[column_names.usage])
        self.number_of_days = int(row[column_names.number_of_days])


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
        self.usage = float(row["USAGE"])


def _newline_line_ending(data: str) -> str:
    """
    Returns a string with every line ending in a single newline
    character.

    Each bill CSV or TSV row ends variously, in a newline,
    carriage return, and even a carriage return followed by a
    newline. The company detection and parsing code crash unless
    each row ends in one newline and nothing else.
    """
    data = data.replace("\r", "\n")
    # replaces any number of consecutive newlines with one newline
    regex = re.compile(r"\n+")
    data = re.sub(regex, "\n", data)
    return data


def _remove_double_quotes(data: str) -> str:
    """Return a string with the double quotes removed."""
    return data.replace('"', "")


def _replace_tabs_with_commas(data: str) -> str:
    """Return a a string with tabs replaced by commas."""
    return data.replace("\t", ",")


def _remove_non_ascii_or_newline_characters(data: str) -> str:
    """Remove all non-ASCII, non-newline characters"""
    return "".join(
        character for character in data if character in _ASCII_CHARACTERS_PLUS_NEWLINE
    )


def _column_name_in_header(column_names: list[str], header: str) -> bool:
    for name in column_names:
        if name in header:
            return True
    return False


def _detect_gas_company(data: str) -> NaturalGasCompany:
    """
    Return which natural gas company issued this bill.
    """
    header = data.split("\n")[0]
    date_exists = _column_name_in_header(constants.READ_DATE_NAMES_EVERSOURCE, header)
    days_exist = _column_name_in_header(constants.READ_DATE_NAMES_EVERSOURCE, header)
    therms_exist = _column_name_in_header(constants.USAGE_NAMES_EVERSOURCE, header)
    is_eversource = date_exists and days_exist and therms_exist

    if _NaturalGasCompanyBillRegex.NATIONAL_GRID.search(data):
        return NaturalGasCompany.NATIONAL_GRID
    elif is_eversource:
        return NaturalGasCompany.EVERSOURCE
    else:
        print("bad header")
        print(header)
        raise ValueError("""Could not detect which company this bill was from""")


def parse_gas_bill(
    data: str, company: NaturalGasCompany | None = None
) -> NaturalGasBillingInput:
    """
    Parse a natural gas bill from a given natural gas company.

    Tries to automatically detect the company that sent the bill.
    Otherwise, requires the company be passed as an argument.
    """
    data = _newline_line_ending(data)
    data = _remove_double_quotes(data)
    data = _replace_tabs_with_commas(data)
    data = _remove_non_ascii_or_newline_characters(data)

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
        month_day_year = r"^\d{1,2}/\d{1,2}/\d{2}$"
        if re.match(month_day_year, date_string):
            return datetime.strptime(date_string, "%m/%d/%y")
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
    # Read the header from the first row
    header = f.readline()
    # Pass the header to ColumnNamesEversource
    column_names = _ColumnNamesEversource(header)
    # Reset the file pointer to the beginning
    f.seek(0)
    records = []
    for row in reader:
        parsed_row = _GasBillRowEversource(row, column_names)
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
    header_row = "TYPE,START DATE,END DATE,USAGE,UNITS,COST,NOTES"
    header_found = False

    # Read lines until the header row is found
    header_row_index = 0
    for line in f:
        if line.strip() != header_row:
            header_row_index += 1
        else:
            header_found = True
            break

    f.seek(0)
    for _ in range(header_row_index):
        next(f)

    if not header_found:
        raise ValueError("Header row not found in the CSV data")

    # Create a DictReader using the header row
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
