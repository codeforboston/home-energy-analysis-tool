import pathlib
from datetime import datetime
import chardet

import pytest

from rules_engine import parser
from rules_engine.pydantic_models import NaturalGasBillingRecordInput

ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
_ROOT_DIR_ALTERNATE_NATURAL_GAS_BILL_FILES = (
    pathlib.Path(__file__).parent / "alternate_natural_gas_bills"
)


class _GasBillPaths:
    EVERSOURCE_LATEST = (
        ROOT_DIR / "natural_gas" / "feldman" / "natural-gas-eversource.csv"
    )
    NATIONAL_GRID_LATEST = (
        ROOT_DIR / "natural_gas" / "quateman" / "natural-gas-national-grid.csv"
    )
    NATIONAL_GRID_WITH_BLANK_LINE_AFTER_HEADER = (
        _ROOT_DIR_ALTERNATE_NATURAL_GAS_BILL_FILES
        / "national-grid-with-blank-line-after-header"
        / "national-grid.csv"
    )
    NATIONAL_GRID_WITH_M_D_YY_FORMAT = (
        _ROOT_DIR_ALTERNATE_NATURAL_GAS_BILL_FILES
        / "national-grid-with-m-d-yy-format"
        / "national-grid.csv"
    )
    NATIONAL_GRID_WITH_YYYY_M_D_FORMAT = (
        _ROOT_DIR_ALTERNATE_NATURAL_GAS_BILL_FILES
        / "national-grid-with-yyyy-m-d-format"
        / "national-grid.csv"
    )
    EVERSOURCE_WITH_ALTERNATE_FORMAT = (
        _ROOT_DIR_ALTERNATE_NATURAL_GAS_BILL_FILES
        / "eversource-with-alternate-format"
        / "eversource.csv"
    )


def _read_gas_bill(path: str) -> str:
    """Read a test natural gas bill from a test CSV"""
    with open(path, "rb") as f:
        raw_data = f.read()
        result = chardet.detect(raw_data)
        encoding = result["encoding"]

    with open(path, encoding=encoding) as f:
        return f.read()


def _validate_eversource_latest(result):
    """Validate the result of reading an Eversource CSV."""
    assert len(result.records) == 36
    for row in result.records:
        assert isinstance(row, NaturalGasBillingRecordInput)

    # input: 12/17/2021,124.00,29,4.28,$224.09,39.0
    # from excel: 11/19/2021,12/17/2021,29,124,,1,4.28,3.82

    second_row = result.records[1]
    assert second_row.period_start_date == datetime(2021, 11, 19)
    assert second_row.period_end_date == datetime(2021, 12, 17)
    assert isinstance(second_row.usage_therms, float)
    assert second_row.usage_therms == 124
    assert second_row.inclusion_override == None


def _validate_national_grid_latest(result):
    """Validate the result of reading a National Grid CSV."""
    assert len(result.records) == 25
    for row in result.records:
        assert isinstance(row, NaturalGasBillingRecordInput)

    # input: Natural gas billing,11/5/2020,12/3/2020,36,therms,$65.60 ,
    # from excel: 11/6/2020,12/3/2020,28,36,,1,1.29,0.99

    second_row = result.records[1]
    assert second_row.period_start_date == datetime(2020, 11, 5)
    assert second_row.period_end_date == datetime(2020, 12, 3)
    assert isinstance(second_row.usage_therms, float)
    assert second_row.usage_therms == 36
    assert second_row.inclusion_override == None


def test_parse_gas_bill_eversource_latest():
    """
    Tests parsing a natural gas bill from Eversource in the latest
    format.
    """
    _validate_eversource_latest(
        parser.parse_gas_bill(_read_gas_bill(_GasBillPaths.EVERSOURCE_LATEST))
    )


def test_parse_gas_bill_national_grid_latest():
    """
    Tests parsing a natural gas bill from National Grid in the latest
    format.
    """
    _validate_national_grid_latest(
        parser.parse_gas_bill(_read_gas_bill(_GasBillPaths.NATIONAL_GRID_LATEST))
    )


def test_parse_gas_bill_national_grid_with_blank_line_after_header():
    """
    Tests parsing a natural gas bill from a National Grid CSV with a
    blank line after its header.

    Name,BOB SMITH
    Address,"1 MAIN ST, DORCHESTER MA 02124"
    Account Number,1234567890
    Service,Service 1

    TYPE,START DATE,END DATE,USAGE,UNITS,COST,NOTES

    Note the blank line between the header and key row.
    """
    parser.parse_gas_bill(
        _read_gas_bill(_GasBillPaths.NATIONAL_GRID_WITH_BLANK_LINE_AFTER_HEADER)
    )


def test_parse_gas_bill_with_m_d_yy():
    """
    Tests parsing a natural gas bill from a National Grid CSV with
    m-d-yy format.

    Example rows:
    Natural gas billing,7/11/17,8/7/17,23,therms,$32.58 ,

    Natural gas billing,8/8/17,9/7/17,23,therms,$32.55 ,

    m - 1 or 2 digit month
    d - 1 or 2 digit day
    yy - 2 digit year

    The blank line between rows is intentional, as it appears in the
    CSV.
    """
    parser.parse_gas_bill(
        _read_gas_bill(_GasBillPaths.NATIONAL_GRID_WITH_M_D_YY_FORMAT)
    )


def test_parse_gas_bill_with_yyyy_m_d():
    """
    Tests parsing a natural gas bill from a National Grid CSV with
    yyyy-m-d format.

    Example rows
    Natural gas billing,2020-06-17,2020-07-17,35.00,therms,$41.57,
    Natural gas billing,2020-07-18,2020-08-14,30.00,therms,$35.19,

    yyyy - 4 digit year
    m - 1 or 2 digit month
    d - 1 or 2 digit day
    """
    parser.parse_gas_bill(
        _read_gas_bill(_GasBillPaths.NATIONAL_GRID_WITH_YYYY_M_D_FORMAT)
    )


def test_parse_gas_bill_with_eversource_with_alternate_format():
    """
    Tests parsing a natural gas bill from an Eversource CSV with
    an alternate format

    End Date	Days In Bill	Meter Read	Read Type	Usage (CCF)	Usage (Therms)	Usage (Cost)
    "7/12/2021"	"32"	"9113"	"ACTUAL"	"18"	"18"	"$30.58"
    "6/10/2021"	"30"	"9095"	"ACTUAL"	"41"	"42"	"$54.06"
    "5/11/2021"	"32"	"9054"	"ACTUAL"	"143"	"147"	"$211.70"
    "4/9/2021"	"31"	"8911"	"ACTUAL"	"221"	"227"	"$352.45"
    "3/9/2021"	"29"	"8690"	"ACTUAL"	"359"	"369"	"$564.63"
    "2/8/2021"	"30"	"8331"	"ACTUAL"	"369"	"380"	"$581.54"
    "1/9/2021"	"30"	"7962"	"ACTUAL"	"327"	"336"	"$515.54"
    "12/10/2020"	"33"	"7635"	"ACTUAL"	"232"	"238"	"$369.75"

    Note the different column key row from the latest Eversource
    format, the tab separation of that row and the columns, and the
    double quotation of every column value.
    """
    parser.parse_gas_bill(
        _read_gas_bill(_GasBillPaths.EVERSOURCE_WITH_ALTERNATE_FORMAT)
    )


def test_detect_natural_gas_company():
    """Tests if the natural gas company is correctly detected from the parsed csv."""
    read_eversource = _read_gas_bill(_GasBillPaths.EVERSOURCE_LATEST)
    read_nationalgrid = _read_gas_bill(_GasBillPaths.NATIONAL_GRID_LATEST)
    assert (
        parser._detect_gas_company(read_eversource)
        == parser.NaturalGasCompany.EVERSOURCE
    )
    assert (
        parser._detect_gas_company(read_nationalgrid)
        == parser.NaturalGasCompany.NATIONAL_GRID
    )


def test_detect_natural_gas_company_with_error():
    """Tests if an error is raised if the natural gas company is incorrect in the csv."""
    read_csv_string = r"Some bogus string input"
    with pytest.raises(ValueError):
        parser._detect_gas_company(read_csv_string)
