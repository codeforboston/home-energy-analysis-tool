from datetime import date

import pytest
from pytest import approx

from rules_engine import engine
from rules_engine.pydantic_models import (
    AnalysisType,
    BalancePointGraph,
    DhwInput,
    FuelType,
    NaturalGasBillingInput,
    NormalizedBillingPeriodRecordInput,
    SummaryInput,
    SummaryOutput,
    TemperatureInput,
)


@pytest.mark.parametrize(
    "avg_temp, balance_point, expected_result",
    [
        (72, 60, 0),  # outside hotter than balance point
        (60, 60, 0),  # outside equal to balance point
        (57, 60, 3),  # outside cooler than balance point
    ],
)
def test_hdd(avg_temp, balance_point, expected_result):
    assert engine.hdd(avg_temp, balance_point) == expected_result


@pytest.mark.parametrize(
    "temps, expected_result",
    [
        ([72, 60, 55, 61], 5),  # one day with HDDs
        ([52, 60, 55], 13),  # two days with HDDs
        ([72, 60, 65, 60, 80], 0),  # no days with HDDs
    ],
)
def test_period_hdd(temps, expected_result):
    assert engine.period_hdd(temps, 60) == expected_result


def test_date_to_analysis_type():
    test_date = date.fromisoformat("2019-01-04")
    assert engine.date_to_analysis_type(test_date) == AnalysisType.INCLUDE

    dates = ["2019-01-04", "2019-07-04", "2019-12-04"]
    types = [engine.date_to_analysis_type(date.fromisoformat(d)) for d in dates]
    expected_types = [
        AnalysisType.INCLUDE,
        AnalysisType.INCLUDE_IN_OTHER_ANALYSIS,
        AnalysisType.INCLUDE,
    ]
    assert types == expected_types


def test_get_average_indoor_temperature():
    set_temp = 68
    setback = 62
    setback_hrs = 8

    # when there is no setback, just put 0 for the setback parameters
    assert engine.get_average_indoor_temperature(set_temp, 0, 0) == set_temp
    assert engine.get_average_indoor_temperature(set_temp, setback, setback_hrs) == 66


def test_bp_ua_estimates():
    billing_periods = [
        engine.BillingPeriod([28, 29, 30, 29], 50, AnalysisType.INCLUDE),
        engine.BillingPeriod([32, 35, 35, 38], 45, AnalysisType.INCLUDE),
        engine.BillingPeriod([41, 43, 42, 42], 30, AnalysisType.INCLUDE),
        engine.BillingPeriod([72, 71, 70, 69], 0.96, AnalysisType.DO_NOT_INCLUDE),
    ]
    heat_sys_efficiency = 0.88
    living_area = 1000
    thermostat_set_point = 68
    setback_temperature = 60
    setback_hours_per_day = 8
    fuel_type = FuelType.GAS
    design_temperature = 60
    summary_input = SummaryInput(
        living_area=living_area,
        fuel_type=fuel_type,
        heating_system_efficiency=heat_sys_efficiency,
        thermostat_set_point=thermostat_set_point,
        setback_temperature=setback_temperature,
        setback_hours_per_day=setback_hours_per_day,
        design_temperature=design_temperature,
    )

    home = engine.Home(
        summary_input,
        billing_periods,
        initial_balance_point=58,
    )

    home.calculate()

    ua_1, ua_2, ua_3 = [bill.ua for bill in home.bills_winter]

    assert home.balance_point == 60
    assert ua_1 == approx(1450.5, abs=1)
    assert ua_2 == approx(1615.3, abs=1)
    assert ua_3 == approx(1479.6, abs=1)
    assert home.avg_ua == approx(1515.1, abs=1)
    assert home.stdev_pct == approx(0.0474, abs=0.01)


def test_bp_ua_with_outlier():
    billing_periods = [
        engine.BillingPeriod([41.7, 41.6, 32, 25.4], 60, AnalysisType.INCLUDE),
        engine.BillingPeriod([28, 29, 30, 29], 50, AnalysisType.INCLUDE),
        engine.BillingPeriod([32, 35, 35, 38], 45, AnalysisType.INCLUDE),
        engine.BillingPeriod([41, 43, 42, 42], 30, AnalysisType.INCLUDE),
        engine.BillingPeriod([72, 71, 70, 69], 0.96, AnalysisType.DO_NOT_INCLUDE),
    ]

    heat_sys_efficiency = 0.88

    living_area = 1000
    thermostat_set_point = 68
    setback_temperature = 60
    setback_hours_per_day = 8
    fuel_type = FuelType.GAS
    design_temperature = 60
    summary_input = SummaryInput(
        living_area=living_area,
        fuel_type=fuel_type,
        heating_system_efficiency=heat_sys_efficiency,
        thermostat_set_point=thermostat_set_point,
        setback_temperature=setback_temperature,
        setback_hours_per_day=setback_hours_per_day,
        design_temperature=design_temperature,
    )

    home = engine.Home(
        summary_input,
        billing_periods,
        initial_balance_point=58,
    )

    home.calculate()

    ua_1, ua_2, ua_3 = [bill.ua for bill in home.bills_winter]

    assert home.balance_point == 60
    assert ua_1 == approx(1450.5, abs=1)
    assert ua_2 == approx(1615.3, abs=1)
    assert ua_3 == approx(1479.6, abs=1)
    assert home.avg_ua == approx(1515.1, abs=1)
    assert home.stdev_pct == approx(0.0474, abs=0.01)


def test_convert_to_intermediate_billing_periods():
    temperature_input = TemperatureInput(
        dates=[
            date(2022, 12, 1),
            date(2022, 12, 2),
            date(2022, 12, 3),
            date(2022, 12, 4),
            date(2023, 1, 1),
            date(2023, 1, 2),
            date(2023, 1, 3),
            date(2023, 1, 4),
            date(2023, 2, 1),
            date(2023, 2, 2),
            date(2023, 2, 3),
            date(2023, 2, 4),
            date(2023, 3, 1),
            date(2023, 3, 2),
            date(2023, 3, 3),
            date(2023, 3, 4),
            date(2023, 4, 1),
            date(2023, 4, 2),
            date(2023, 4, 3),
            date(2023, 4, 4),
        ],
        temperatures=[
            41.7,
            41.6,
            32,
            25.4,
            28,
            29,
            30,
            29,
            32,
            35,
            35,
            38,
            41,
            43,
            42,
            42,
            72,
            71,
            70,
            69,
        ],
    )

    billing_periods = [
        NormalizedBillingPeriodRecordInput(
            period_start_date=date(2022, 12, 1),
            period_end_date=date(2022, 12, 4),
            usage=60,
            inclusion_override=None,
        ),
        NormalizedBillingPeriodRecordInput(
            period_start_date=date(2023, 1, 1),
            period_end_date=date(2023, 1, 4),
            usage=50,
            inclusion_override=None,
        ),
        NormalizedBillingPeriodRecordInput(
            period_start_date=date(2023, 2, 1),
            period_end_date=date(2023, 2, 4),
            usage=45,
            inclusion_override=None,
        ),
        NormalizedBillingPeriodRecordInput(
            period_start_date=date(2023, 3, 1),
            period_end_date=date(2023, 3, 4),
            usage=30,
            inclusion_override=None,
        ),
        NormalizedBillingPeriodRecordInput(
            period_start_date=date(2023, 4, 1),
            period_end_date=date(2023, 4, 4),
            usage=0.96,
            inclusion_override=None,
        ),
    ]

    results = engine.convert_to_intermediate_billing_periods(
        temperature_input, billing_periods
    )

    expected_results = [
        engine.BillingPeriod([41.7, 41.6, 32, 25.4], 60, AnalysisType.INCLUDE),
        engine.BillingPeriod([28, 29, 30, 29], 50, AnalysisType.INCLUDE),
        engine.BillingPeriod([32, 35, 35, 38], 45, AnalysisType.INCLUDE),
        engine.BillingPeriod([41, 43, 42, 42], 30, AnalysisType.INCLUDE),
        engine.BillingPeriod([72, 71, 70, 69], 0.96, AnalysisType.DO_NOT_INCLUDE),
    ]

    for i in range(len(expected_results)):
        result = results[i]
        expected_result = expected_results[i]

        assert result.avg_temps == expected_result.avg_temps
        assert result.usage == expected_result.usage
        assert result.analysis_type == expected_result.analysis_type
