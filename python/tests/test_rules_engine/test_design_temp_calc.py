from datetime import date

from pytest import approx

from rules_engine.helpers import calculate_design_temperature, get_date_range

LAT = 42.29244555
LON = -70.98631661


def test_design_temperature_calculator():
    """
    Validate the design temperature calculator with a given lat and lon representing a home address
    Input: home address (lat, lon), start_date, end_date
    Output: design_temp = float
    """

    start_date, end_date = get_date_range(30)

    design_temp, elapsed = calculate_design_temperature(
        LAT, LON, start_date=start_date, end_date=end_date
    )

    assert design_temp == approx(12.193, abs=0.1)
