from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List, Union, Tuple

from geocode_utils import GeocodeUtil
from weather_utils import WeatherUtil


# You can define this more strictly with dataclasses or TypedDict if needed
AddressComponents = Dict[str, str]
TemperatureInputDataConverted = Dict[str, List[Union[str, None]]]
NaturalGasUsageDataSchema = Dict[str, Any]  # Adjust this type if needed


def get_converted_dates_tiwd(
    pyodide_results_from_text_file: NaturalGasUsageDataSchema,
    street_address: str,
    city: str,
    state: str
) -> Dict[str, Any]:
    """
    Takes CSV-derived data and an address, returns converted weather data
    and geocoding information.
    """
    print("Loading geocode_util/weather_util")


    combined_address = f"{street_address}, {city}, {state}"
    geocode_result = GeocodeUtil.get_ll(combined_address)

    coordinates = geocode_result.get("coordinates", {"x": 0, "y": 0})
    x = coordinates.get("x", 0)
    y = coordinates.get("y", 0)

    print("Geocoded", x, y)

    start_date_string = pyodide_results_from_text_file.get("overall_start_date")
    end_date_string = pyodide_results_from_text_file.get("overall_end_date")

    if not isinstance(start_date_string, str) or not isinstance(end_date_string, str):
        raise ValueError("Start date or end date is missing or invalid")

    today = datetime.today()
    two_years_ago = today.replace(year=today.year - 2)

    try:
        start_date = datetime.fromisoformat(start_date_string)
    except Exception:
        print("Invalid start date, using date from 2 years ago")
        start_date = two_years_ago

    try:
        end_date = datetime.fromisoformat(end_date_string)
    except Exception:
        print("Invalid end date, using today's date")
        end_date = today

    def format_date_string(date: datetime) -> str:
        return date.date().isoformat()

    weather_data = WeatherUtil.get_that_weatha_data(
        x, y,
        format_date_string(start_date),
        format_date_string(end_date)
    )

    if weather_data is None:
        raise RuntimeError("Weather data failed to fetch")

    dates_from_tiwd = [
        d.date().isoformat() if isinstance(d, datetime) else str(d)
        for d in weather_data["dates"]
    ]

    converted_dates_tiwd: TemperatureInputDataConverted = {
        "dates": dates_from_tiwd,
        "temperatures": weather_data["temperatures"]
    }

    return {
        "convertedDatesTIWD": converted_dates_tiwd,
        "state_id": geocode_result.get("state_id"),
        "county_id": geocode_result.get("county_id"),
        "coordinates": coordinates,
        "addressComponents": geocode_result.get("addressComponents")
    }
