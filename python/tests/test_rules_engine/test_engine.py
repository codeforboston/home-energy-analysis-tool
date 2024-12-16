from datetime import date, datetime
from typing import Any

import pytest
from pytest import approx

from rules_engine import engine
from rules_engine.pydantic_models import (
    AnalysisType,
    BalancePointGraph,
    DhwInput,
    FuelType,
    HeatLoadInput,
    HeatLoadOutput,
    NaturalGasBillingInput,
    ProcessedEnergyBillInput,
    TemperatureInput,
)

_dummy_processed_energy_bill_input = ProcessedEnergyBillInput(
    period_start_date=datetime(2024, 1, 1),
    period_end_date=datetime(2024, 2, 1),
    usage=1.0,
    inclusion_override=False,
)


@pytest.fixture()
def sample_intermediate_energy_bill_inputs() -> list[engine.IntermediateEnergyBill]:
    intermediate_energy_bill_inputs = [
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [28, 29, 30, 29],
            50,
            AnalysisType.ALLOWED_HEATING_USAGE,
            True,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [32, 35, 35, 38],
            45,
            AnalysisType.ALLOWED_HEATING_USAGE,
            True,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [41, 43, 42, 42],
            30,
            AnalysisType.ALLOWED_HEATING_USAGE,
            True,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [72, 71, 70, 69],
            0.96,
            AnalysisType.NOT_ALLOWED_IN_CALCULATIONS,
            False,
            False,
        ),
    ]
    return intermediate_energy_bill_inputs


@pytest.fixture()
def sample_intermediate_energy_bill_inputs_with_outlier() -> (
    list[engine.IntermediateEnergyBill]
):
    intermediate_energy_bill_inputs = [
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [41.7, 41.6, 32, 25.4],
            60,
            AnalysisType.ALLOWED_HEATING_USAGE,
            True,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [28, 29, 30, 29],
            50,
            AnalysisType.ALLOWED_HEATING_USAGE,
            True,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [32, 35, 35, 38],
            45,
            AnalysisType.ALLOWED_HEATING_USAGE,
            True,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [41, 43, 42, 42],
            30,
            AnalysisType.ALLOWED_HEATING_USAGE,
            True,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [72, 71, 70, 69],
            0.96,
            AnalysisType.NOT_ALLOWED_IN_CALCULATIONS,
            False,
            False,
        ),
    ]

    return intermediate_energy_bill_inputs


@pytest.fixture()
def sample_heat_load_inputs() -> HeatLoadInput:
    heat_sys_efficiency = 0.88

    living_area = 1000
    thermostat_set_point = 68
    setback_temperature = 60
    setback_hours_per_day = 8
    fuel_type = FuelType.GAS
    design_temperature = 60
    heat_load_input = HeatLoadInput(
        living_area=living_area,
        fuel_type=fuel_type,
        heating_system_efficiency=heat_sys_efficiency,
        thermostat_set_point=thermostat_set_point,
        setback_temperature=setback_temperature,
        setback_hours_per_day=setback_hours_per_day,
        design_temperature=design_temperature,
    )
    return heat_load_input


@pytest.fixture()
def sample_temp_inputs() -> TemperatureInput:
    temperature_dict: Any = {
        "dates": [
            "2022-12-01",
            "2022-12-02",
            "2022-12-03",
            "2022-12-04",
            "2023-01-01",
            "2023-01-02",
            "2023-01-03",
            "2023-01-04",
            "2023-02-01",
            "2023-02-02",
            "2023-02-03",
            "2023-02-04",
            "2023-03-01",
            "2023-03-02",
            "2023-03-03",
            "2023-03-04",
            "2023-04-01",
            "2023-04-02",
            "2023-04-03",
            "2023-04-04",
        ],
        "temperatures": [
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
    }

    return TemperatureInput(
        temperatures=temperature_dict["temperatures"],
        dates=temperature_dict["dates"],
    )


@pytest.fixture()
def sample_normalized_processed_energy_bill_inputs() -> list[ProcessedEnergyBillInput]:
    processed_energy_bill_inputs_dict: Any = [
        {
            "period_start_date": "2022-12-01",
            "period_end_date": "2022-12-04",
            "usage": 60,
            "inclusion_override": False,
            "default_inclusion": True,
        },
        {
            "period_start_date": "2023-01-01",
            "period_end_date": "2023-01-04",
            "usage": 50,
            "inclusion_override": False,
            "default_inclusion": True,
        },
        {
            "period_start_date": "2023-02-01",
            "period_end_date": "2023-02-04",
            "usage": 45,
            "inclusion_override": False,
            "default_inclusion": True,
        },
        {
            "period_start_date": "2023-03-01",
            "period_end_date": "2023-03-04",
            "usage": 30,
            "inclusion_override": False,
            "default_inclusion": True,
        },
        {
            "period_start_date": "2023-04-01",
            "period_end_date": "2023-04-04",
            "usage": 0.96,
            "inclusion_override": False,
            "default_inclusion": True,
        },
        {
            "period_start_date": "2023-05-01",
            "period_end_date": "2023-05-04",
            "usage": 0.96,
            "inclusion_override": False,
            "default_inclusion": False,
        },
    ]

    # processed_energy_bill_inputs = [
    #     ProcessedEnergyBillInput(**x) for x in processed_energy_bill_inputs_dict
    # ]

    processed_energy_bill_inputs = [
        ProcessedEnergyBillInput(
            period_start_date=datetime.fromisoformat(x["period_start_date"]),
            period_end_date=datetime.fromisoformat(x["period_end_date"]),
            usage=x["usage"],
            inclusion_override=x["inclusion_override"],
        )
        for x in processed_energy_bill_inputs_dict
    ]

    return processed_energy_bill_inputs


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


def test_date_to_analysis_type_natural_gas():
    test_date = date.fromisoformat("2019-01-04")
    analysis_type, default_inclusion = engine._date_to_analysis_type_natural_gas(
        test_date
    )
    assert (
        analysis_type == AnalysisType.ALLOWED_HEATING_USAGE
        and default_inclusion == True
    )


""" TODO:
    dates = ["2019-01-04", "2019-07-04", "2019-12-04"]
    types = [
        engine._date_to_analysis_type_natural_gas(date.fromisoformat(d)) for d in dates
    ]
    expected_types = [
        AnalysisType.ALLOWED_HEATING_USAGE,
        AnalysisType.ALLOWED_NON_HEATING_USAGE,
        AnalysisType.ALLOWED_HEATING_USAGE,
    ]
    assert types == expected_types
"""


def test_get_average_indoor_temperature():
    set_temp = 68
    setback = 62
    setback_hrs = 8

    # when there is no setback, just put 0 for the setback parameters
    assert engine.get_average_indoor_temperature(set_temp, 0, 0) == set_temp
    assert engine.get_average_indoor_temperature(set_temp, setback, setback_hrs) == 66


def test_bp_ua_estimates(
    sample_heat_load_inputs, sample_intermediate_energy_bill_inputs
):
    home = engine.Home.calculate(
        sample_heat_load_inputs,
        sample_intermediate_energy_bill_inputs,
        dhw_input=None,
        initial_balance_point=58,
    )

    ua_1, ua_2, ua_3 = [bill.ua for bill in home.winter_processed_energy_bills]

    assert home.balance_point == 60.5
    assert ua_1 == approx(1455.03, abs=0.01)
    assert ua_2 == approx(1617.65, abs=0.01)
    assert ua_3 == approx(1486.49, abs=0.01)
    assert home.avg_ua == approx(1519.72, abs=1)
    assert home.stdev_pct == approx(0.0463, abs=0.01)


def test_bp_ua_with_outlier(
    sample_heat_load_inputs, sample_intermediate_energy_bill_inputs_with_outlier
):
    home = engine.Home.calculate(
        sample_heat_load_inputs,
        sample_intermediate_energy_bill_inputs_with_outlier,
        dhw_input=None,
        initial_balance_point=58,
    )

    # expect that ua_1 is considered an outlier and not used in winter_processed_energy_bills
    ua_2, ua_3, ua_4 = [bill.ua for bill in home.winter_processed_energy_bills]

    assert home.balance_point == 60.5
    assert ua_2 == approx(1455.03, abs=0.01)
    assert ua_3 == approx(1617.65, abs=0.01)
    assert ua_4 == approx(1486.49, abs=0.01)
    assert home.avg_ua == approx(1519.72, abs=1)
    assert home.stdev_pct == approx(0.0463, abs=0.01)


def test_convert_to_intermediate_processed_energy_bills(
    sample_temp_inputs, sample_normalized_processed_energy_bill_inputs
):
    results = engine.convert_to_intermediate_processed_energy_bills(
        sample_temp_inputs,
        sample_normalized_processed_energy_bill_inputs,
        FuelType.GAS,
    )

    expected_results = [
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [41.7, 41.6, 32, 25.4],
            60,
            AnalysisType.ALLOWED_HEATING_USAGE,
            False,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [28, 29, 30, 29],
            50,
            AnalysisType.ALLOWED_HEATING_USAGE,
            False,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [32, 35, 35, 38],
            45,
            AnalysisType.ALLOWED_HEATING_USAGE,
            False,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [41, 43, 42, 42],
            30,
            AnalysisType.ALLOWED_HEATING_USAGE,
            False,
            False,
        ),
        engine.IntermediateEnergyBill(
            _dummy_processed_energy_bill_input,
            [72, 71, 70, 69],
            0.96,
            AnalysisType.ALLOWED_HEATING_USAGE,
            False,
            False,
        ),
    ]

    for i in range(len(expected_results)):
        result = results[i]
        expected_result = expected_results[i]

        assert result.avg_temps == expected_result.avg_temps
        assert result.usage == expected_result.usage
        assert result.analysis_type == expected_result.analysis_type


def test_get_outputs_normalized(
    sample_heat_load_inputs,
    sample_temp_inputs,
    sample_normalized_processed_energy_bill_inputs,
):
    rules_engine_result = engine.get_outputs_normalized(
        sample_heat_load_inputs,
        None,
        sample_temp_inputs,
        sample_normalized_processed_energy_bill_inputs,
    )

    assert rules_engine_result.heat_load_output.estimated_balance_point == 60.5
    assert rules_engine_result.heat_load_output.whole_home_heat_loss_rate == approx(
        1519.72, abs=1
    )
    assert (
        rules_engine_result.heat_load_output.standard_deviation_of_heat_loss_rate
        == approx(0.0463, abs=0.01)
    )
    assert rules_engine_result.processed_energy_bills[0].usage == 60
    assert (
        rules_engine_result.processed_energy_bills[0].whole_home_heat_loss_rate != None
    )
    assert (
        rules_engine_result.processed_energy_bills[5].whole_home_heat_loss_rate == None
    )


@pytest.mark.parametrize(
    "sample_dhw_inputs, summary_input_heating_system_efficiency, expected_fuel_oil_usage",
    [
        (
            DhwInput(
                number_of_occupants=2,
                estimated_water_heating_efficiency=None,
                stand_by_losses=None,
            ),
            0.80,
            0.17,
        ),
        (
            DhwInput(
                number_of_occupants=2,
                estimated_water_heating_efficiency=0.8,
                stand_by_losses=None,
            ),
            0.85,
            0.17,
        ),
        (
            DhwInput(
                number_of_occupants=4,
                estimated_water_heating_efficiency=0.8,
                stand_by_losses=None,
            ),
            0.84,
            0.35,
        ),
        (
            DhwInput(
                number_of_occupants=5,
                estimated_water_heating_efficiency=0.8,
                stand_by_losses=None,
            ),
            0.83,
            0.43,
        ),
        (
            DhwInput(
                number_of_occupants=5,
                estimated_water_heating_efficiency=0.8,
                stand_by_losses=0.10,
            ),
            0.82,
            0.46,
        ),
    ],
)
def test_calculate_dhw_usage(
    sample_dhw_inputs, summary_input_heating_system_efficiency, expected_fuel_oil_usage
):
    fuel_oil_usage = engine.calculate_dhw_usage(
        sample_dhw_inputs, summary_input_heating_system_efficiency
    )
    assert fuel_oil_usage == approx(expected_fuel_oil_usage, abs=0.01)
