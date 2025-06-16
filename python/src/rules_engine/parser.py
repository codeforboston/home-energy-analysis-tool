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


_ASCII_CHARACTERS = [
    ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
    '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
    '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~'
]


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


class ColumnNamesEversource:
    """Column names of an Eversource natural gas bill"""
    def __init__(self, header: str):
        print("eversource", header)
        print("read date exists", "Read Date" in header)
        print("end date exists", "End Date" in header)
        if "Read Date" in header:
            self.read_date = "Read Date"
        elif "End Date" in header:
            self.read_date = "End Date"
        else:
            raise ValueError("Date header not found")

        if "Number of Days" in header:
            self.number_of_days = "Number of Days"
        elif "Days In Bill" in header:
            self.number_of_days = "Days In Bill" 
        else:
            raise ValueError("Number of Days header not found")

        if "Usage (Therms)" in header:
            self.usage = "Usage (Therms)"
        elif "Usage" in header:
            self.usage = "Usage"
        else:
            raise ValueError("Usage header not found")


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

    def __init__(self, row, column_names: ColumnNamesEversource):
        self.read_date = row[column_names.read_date]
        self.usage = row[column_names.usage]
        self.number_of_days = row[column_names.number_of_days]


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
    return data.replace('"', '')


def _replace_tabs_with_commas(data: str) -> str:
    """Return a a string with tabs replaced by commas."""
    return data.replace("\t", ",")


def _detect_gas_company(data: str) -> NaturalGasCompany:
    """
    Return which natural gas company issued this bill.
    """
    header = data.split("\n")[0]
    print("header", header)
    date_exists = "End Date" in header or "Read Date" in header
    days_exist = "Days In Bill" in header or "Days" in header
    therms_exist = "Usage" in header or "Usage (Therms)" in header
    is_eversource = date_exists and days_exist and therms_exist
    print("debug logic parser.py:159")
    print("header", header)
    print("date_exists", "days_exist", "therms_exist")
    print(date_exists, days_exist, therms_exist)
    print()

    if _NaturalGasCompanyBillRegex.NATIONAL_GRID.search(data):
        return NaturalGasCompany.NATIONAL_GRID
    elif is_eversource:
        return NaturalGasCompany.EVERSOURCE
    else:
        print("bad header")
        print(header)
        raise ValueError(
            """Could not detect which company this bill was from"""
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
    data = _remove_double_quotes(data)
    data = _replace_tabs_with_commas(data)

    lines = data.split("\n")
    for i, line in enumerate(lines):
        string = ""
        for character in line:
            if character in _ASCII_CHARACTERS and ord(character) != 0:
                string += character
        lines[i] = string + "\n"
    data = "".join(lines)

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
    column_names = ColumnNamesEversource(header)
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
