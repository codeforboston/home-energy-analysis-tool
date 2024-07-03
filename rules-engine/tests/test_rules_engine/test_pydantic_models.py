from datetime import date

import pytest

from rules_engine.pydantic_models import (
    ElectricBillingInput,
    ElectricBillingRecordInput,
    NaturalGasBillingInput,
    NaturalGasBillingRecordInput,
)

_EXAMPLE_VALID_RECORDS_NATURAL_GAS = NaturalGasBillingInput(
    records=[
        NaturalGasBillingRecordInput(
            period_start_date=date(2020, 1, 1),
            period_end_date=date(2020, 1, 31),
            usage_therms=10,
            inclusion_override=None,
        ),
        NaturalGasBillingRecordInput(
            period_start_date=date(2020, 2, 1),
            period_end_date=date(2020, 2, 28),
            usage_therms=10,
            inclusion_override=None,
        ),
    ]
)

_EXAMPLE_VALID_RECORDS_ELECTRIC = ElectricBillingInput(
    records=[
        ElectricBillingRecordInput(
            period_start_date=date(2020, 1, 1),
            period_end_date=date(2020, 1, 31),
            usage_watt_hours=10,
            inclusion_override=None,
        ),
        ElectricBillingRecordInput(
            period_start_date=date(2020, 2, 1),
            period_end_date=date(2020, 2, 28),
            usage_watt_hours=10,
            inclusion_override=None,
        ),
    ]
)

_EXAMPLE_INVALID_RECORDS_NATURAL_GAS = NaturalGasBillingInput(
    records=[]  # create billing input with no records
)

_EXAMPLE_INVALID_RECORDS_ELECTRIC = ElectricBillingInput(
    records=[]  # create billing input with no records
)


def test_natural_gas_billing_input_overall_start_date():
    expected_overall_start_date = date(2020, 1, 1)
    actual_overall_start_date = _EXAMPLE_VALID_RECORDS_NATURAL_GAS.overall_start_date

    assert expected_overall_start_date == actual_overall_start_date


def test_natural_gas_billing_input_overall_end_date():
    expected_overall_end_date = date(2020, 2, 28)
    actual_overall_end_date = _EXAMPLE_VALID_RECORDS_NATURAL_GAS.overall_end_date

    assert expected_overall_end_date == actual_overall_end_date


def test_electric_billing_input_overall_start_date():
    expected_overall_start_date = date(2020, 1, 1)
    actual_overall_start_date = _EXAMPLE_VALID_RECORDS_ELECTRIC.overall_start_date

    assert expected_overall_start_date == actual_overall_start_date


def test_electric_billing_input_overall_end_date():
    expected_overall_end_date = date(2020, 2, 28)
    actual_overall_end_date = _EXAMPLE_VALID_RECORDS_ELECTRIC.overall_end_date

    assert expected_overall_end_date == actual_overall_end_date


def test_natural_gas_billing_input_overall_start_date_invalid():
    with pytest.raises(ValueError):
        _EXAMPLE_INVALID_RECORDS_NATURAL_GAS.overall_start_date


def test_natural_gas_billing_input_overall_end_date_invalid():
    with pytest.raises(ValueError):
        _EXAMPLE_INVALID_RECORDS_NATURAL_GAS.overall_end_date


def test_electric_billing_input_overall_start_date_invalid():
    with pytest.raises(ValueError):
        _EXAMPLE_INVALID_RECORDS_ELECTRIC.overall_start_date


def test_electric_billing_input_overall_end_date_invalid():
    with pytest.raises(ValueError):
        _EXAMPLE_INVALID_RECORDS_ELECTRIC.overall_end_date
