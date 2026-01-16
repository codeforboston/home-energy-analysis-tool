import json
import pathlib

import pytest

from rules_engine.calculate_output import calculate_from_csv

# Paths to test data
TEST_DIR = pathlib.Path(__file__).parent
EXAMPLES_DIR = TEST_DIR / "cases" / "examples" / "natural_gas" / "quateman"
CSV_PATH = EXAMPLES_DIR / "natural-gas-national-grid.csv"
SUMMARY_PATH = EXAMPLES_DIR / "summary.json"


@pytest.mark.skipif(
    not CSV_PATH.exists() or not SUMMARY_PATH.exists(),
    reason="Required test files not found.",
)
def test_run_calculate_with_csv_quateman():
    # Load form data from summary.json
    with open(SUMMARY_PATH) as f:
        summary = json.load(f)
    # Map summary fields to form_data expected by calculate_from_csv
    form_data = {
        "street_address": "100 Sohier Rd",
        "city": "Beverly",
        "state": "MA",
        "living_area": summary["living_area"],
        "fuel_type": summary["fuel_type"],
        "heating_system_efficiency": summary["heating_system_efficiency"],
        "thermostat_set_point": summary["thermostat_set_point"],
        "setback_temperature": summary.get("setback_temperature"),
        "setback_hours_per_day": summary.get("setback_hours_per_day"),
        "design_temperature": summary["design_temperature"],
    }
    with open(CSV_PATH) as f:
        csv_data = f.read()
    # Run calculation
    result = calculate_from_csv(csv_data, form_data)
    rules_engine_result = result["analysisResults"]
    # Assert all key outputs (except average_indoor_temperature)
    assert (
        rules_engine_result.heat_load_output.estimated_balance_point
        == pytest.approx(51.0, abs=0.1)
    )
    assert rules_engine_result.heat_load_output.other_fuel_usage == pytest.approx(
        0.2857142857142857, abs=1e-8
    )
    assert (
        rules_engine_result.heat_load_output.average_indoor_temperature
        == pytest.approx(68.0, abs=0.1)
    )
    assert (
        rules_engine_result.heat_load_output.difference_between_ti_and_tbp
        == pytest.approx(17.0, abs=0.1)
    )
    assert rules_engine_result.heat_load_output.design_temperature == pytest.approx(
        9.5, abs=0.1
    )
    assert (
        rules_engine_result.heat_load_output.whole_home_heat_loss_rate
        == pytest.approx(597.1983566944732, abs=1e-6)
    )
    # Add standard_deviation_of_heat_loss if you have the expected value
    # Check processed_energy_bills whole_home_heat_loss_rate
    for result_bill in rules_engine_result.processed_energy_bills:
        if hasattr(result_bill, "whole_home_heat_loss_rate"):
            assert result_bill.whole_home_heat_loss_rate is not None
