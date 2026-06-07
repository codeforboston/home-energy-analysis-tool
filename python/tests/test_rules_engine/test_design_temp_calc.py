from datetime import date
from rules_engine.design_temp_calc import calculate_design_temperatures, get_date_range
from pytest import approx

def test_design_temperature_calculator():
    """Validate the design temperature calculator with a given lat and lon representing a home address"""
    
    # input: home address (lat, lon), start_date, end_date
    # output: design_temp = float
    LAT = 42.29244555
    LON = -70.98631661

    start_date, end_date = get_date_range(30)

    design_temp, elapsed = calculate_design_temperatures(LAT, LON, start_date=start_date, end_date=end_date)

    # check for the specified value
    assert design_temp == approx(12.193, abs=0.1)



