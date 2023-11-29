import pytest
from pytest import approx

from rules_engine import engine
from rules_engine.pydantic_models import (
    AnalysisType,
    BalancePointGraph,
    DhwInput,
    FuelType,
    NaturalGasBillingInput,
    SummaryInput,
    SummaryOutput,
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


def test_average_indoor_temp():
    set_temp = 68
    setback = 62
    setback_hrs = 8

    # when there is no setback, just put 0 for the setback parameters
    assert engine.average_indoor_temp(set_temp, 0, 0) == set_temp
    assert engine.average_indoor_temp(set_temp, setback, setback_hrs) == 66


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
    summary_input = SummaryInput(
        living_area=living_area,
        fuel_type=fuel_type,
        heating_system_efficiency=heat_sys_efficiency,
        thermostat_set_point=thermostat_set_point,
        setback_temperature=setback_temperature,
        setback_hours_per_day=setback_hours_per_day,
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
    summary_input = SummaryInput(
        living_area=living_area,
        fuel_type=fuel_type,
        heating_system_efficiency=heat_sys_efficiency,
        thermostat_set_point=thermostat_set_point,
        setback_temperature=setback_temperature,
        setback_hours_per_day=setback_hours_per_day,
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
