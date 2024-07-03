import pathlib
from datetime import date

import pytest

from rules_engine import parser
from rules_engine.pydantic_models import (
    ElectricBillingRecordInput,
    NaturalGasBillingRecordInput,
)

ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"

# TODO: Make sure that the tests pass because they're all broken because
# of refactoring elsewhere in the codebase.


def _read_gas_bill_eversource() -> str:
    """Read a test natural gas bill from a test Eversource CSV"""
    with open(ROOT_DIR / "feldman" / "natural-gas-eversource.csv") as f:
        return f.read()


def _read_gas_bill_national_grid() -> str:
    """Read a test natural gas bill from a test National Grid CSV"""
    with open(ROOT_DIR / "quateman" / "natural-gas-national-grid.csv") as f:
        return f.read()


def _get_gas_bill_xml_path() -> pathlib.Path:
    """Return the path of a test natural gas XML bill"""
    return (
        pathlib.Path(__file__).parent
        / "cases"
        / "parsing"
        / "xml"
        / "natural_gas"
        / "ngma_natural_gas_billing_billing_data_Service 1_1_2021-05-26_to_2024-04-25.xml"
    )


def _get_electric_bill_xml_path() -> pathlib.Path:
    """Return the path of a test natural gas XML bill"""
    return (
        pathlib.Path(__file__).parent
        / "cases"
        / "parsing"
        / "xml"
        / "electricicity"
        / "TestGBDataHourlyNineDaysBinnedDaily.xml"
    )


def _validate_eversource(result):
    """Validate the result of reading an Eversource CSV."""
    assert len(result.records) == 36
    for row in result.records:
        assert isinstance(row, NaturalGasBillingRecordInput)

    # input: 12/17/2021,124.00,29,4.28,$224.09,39.0
    # from excel: 11/19/2021,12/17/2021,29,124,,1,4.28,3.82

    second_row = result.records[1]
    assert second_row.period_start_date == date(2021, 11, 19)
    assert second_row.period_end_date == date(2021, 12, 17)
    assert isinstance(second_row.usage_therms, float)
    assert second_row.usage_therms == 124
    assert second_row.inclusion_override == None


def _validate_national_grid(result):
    """Validate the result of reading a National Grid CSV."""
    assert len(result.records) == 25
    for row in result.records:
        assert isinstance(row, NaturalGasBillingRecordInput)

    # input: Natural gas billing,11/5/2020,12/3/2020,36,therms,$65.60 ,
    # from excel: 11/6/2020,12/3/2020,28,36,,1,1.29,0.99

    second_row = result.records[1]
    assert second_row.period_start_date == date(2020, 11, 5)
    assert second_row.period_end_date == date(2020, 12, 3)
    assert isinstance(second_row.usage_therms, float)
    assert second_row.usage_therms == 36
    assert second_row.inclusion_override == None


def _validate_gas_bill_xml(result):
    """Validate the result of reading a National Grid CSV."""
    assert len(result.records) == 35
    for row in result.records:
        assert isinstance(row, NaturalGasBillingRecordInput)

    second_row = result.records[1]
    assert second_row.period_start_date == date(2021, 6, 29)
    assert second_row.period_end_date == date(2021, 7, 27)
    assert isinstance(second_row.usage_therms, float)
    assert second_row.usage_therms == 14
    assert second_row.inclusion_override == None


def _validate_electric_bill_xml(result):
    """Validate the result of reading a National Grid CSV."""
    assert len(result.records) == 216
    for row in result.records:
        assert isinstance(row, ElectricBillingRecordInput)

    second_row = result.records[1]
    assert second_row.period_start_date == date(2014, 1, 1)
    assert second_row.period_end_date == date(2014, 1, 1)
    assert isinstance(second_row.usage_watt_hours, float)
    assert second_row.usage_watt_hours == 273
    assert second_row.inclusion_override == None


def test_parse_gas_bill():
    """
    Tests the logic of parse_gas_bill.
    """
    _validate_eversource(
        parser.parse_gas_bill(
            _read_gas_bill_eversource(), parser.NaturalGasCompany.EVERSOURCE
        )
    )
    _validate_national_grid(
        parser.parse_gas_bill(
            _read_gas_bill_national_grid(), parser.NaturalGasCompany.NATIONAL_GRID
        )
    )
    # TODO: Does not verify that the method crashes when given the wrong
    # enum.


def test_parse_gas_bill_eversource():
    """Tests parsing a natural gas bill from Eversource."""
    _validate_eversource(parser._parse_gas_bill_eversource(_read_gas_bill_eversource()))


def test_parse_gas_bill_national_grid():
    """Tests parsing a natural gas bill from National Grid."""
    _validate_national_grid(
        parser._parse_gas_bill_national_grid(_read_gas_bill_national_grid())
    )


def test_parse_gas_bill_xml():
    """Tests parsing a natural gas bill from a Green Button XML."""
    _validate_gas_bill_xml(parser._parse_gas_bill_xml(_get_gas_bill_xml_path()))


def test_parse_electric_bill_xml():
    """Tests parsing an electricicity bill from a Green Button XML."""
    _validate_electric_bill_xml(
        parser._parse_electric_bill_xml(_get_electric_bill_xml_path())
    )


def test_detect_natural_gas_company():
    """Tests if the natural gas company is correctly detected from the parsed csv."""
    read_eversource = _read_gas_bill_eversource()
    read_nationalgrid = _read_gas_bill_national_grid()
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
