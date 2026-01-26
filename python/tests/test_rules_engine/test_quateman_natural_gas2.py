import pathlib

import pytest
from rules_engine.calculate_output2 import calculate_from_csv

# Paths to test data
TEST_DIR = pathlib.Path(__file__).parent
EXAMPLES_DIR = TEST_DIR / "cases" / "examples" / "natural_gas" / "quateman"
CSV_PATH = EXAMPLES_DIR / "natural-gas-national-grid.csv"


@pytest.mark.skipif(not CSV_PATH.exists(), reason="Required test file not found.")
def test_quateman_natural_gas():
    with open(CSV_PATH) as f:
        csv_data = f.read()
    # Minimal form_data for calculation (adjust as needed)
    form_data = {
        "street_address": "100 Sohier Rd",
        "city": "Beverly",
        "state": "MA",
        "living_area": 2000,  # Example value
        "fuel_type": "GAS",
        "heating_system_efficiency": 97,
        "thermostat_set_point": 68,
        "setback_temperature": 65,
        "setback_hours_per_day": 8,
        "design_temperature": 9.5,
    }
    result = calculate_from_csv(csv_data, form_data)
    rules_engine_result = result["analysisResults"]
    print(
        "Number of processed_energy_bills:",
        len(rules_engine_result.processed_energy_bills),
    )
    for idx, bill in enumerate(rules_engine_result.processed_energy_bills):
        print(
            f"Bill {idx}: period_start={bill.period_start_date}, period_end={bill.period_end_date}, usage={bill.usage}, ua={bill.whole_home_heat_loss_rate}"
        )
    assert len(rules_engine_result.processed_energy_bills) > 0
