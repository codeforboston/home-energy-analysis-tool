"""
Tests for fuel-oil related methods.
"""

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
NATURAL_GAS_DIR = ROOT_DIR / "fuel_oil"


class Example(BaseModel):
    summary: Summary
    natural_gas_usage: NaturalGasBillingExampleInput
    temperature_data: TemperatureInput


@pytest.fixture(scope="module", params=INPUT_DATA)
def data(request):
    """
    Loads the usage and temperature data and summary inputs into an 
    Example instance.
    """
    summary = load_summary(request.param)

    if summary.fuel_type == engine.FuelType.GAS:
        natural_gas_usage = load_natural_gas(
            request.param, summary.estimated_balance_point
        )
    else:
        natural_gas_usage = None

    weather_station_short_name = summary.local_weather_station[:4]
    temperature_data = load_temperature_data(weather_station_short_name)

    example = Example(
        summary=summary,
        natural_gas_usage=natural_gas_usage,
        temperature_data=temperature_data,
    )
    yield example