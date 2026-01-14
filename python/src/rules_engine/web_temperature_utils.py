from datetime import datetime
from typing import Any, Dict, List, Union

from web_geocode_utils import WebGeocodeUtil
from web_weather_utils import WebWeatherUtil

# You can define this more strictly with dataclasses or TypedDict if needed
AddressComponents = Dict[str, str]
TemperatureInputDataConverted = Dict[str, List[Union[str, None]]]
NaturalGasUsageDataSchema = Dict[str, Any]  # Adjust this type if needed


def web_get_converted_dates_tiwd(
    pyodide_results_from_text_file: NaturalGasUsageDataSchema,
    street_address: str,
    city: str,
    state: str,
) -> Dict[str, Any]:
    """
    Takes CSV-derived data and an address, returns converted weather data
    and geocoding information.
    """
    # print removed

    combined_address = f"{street_address}, {city}, {state}"
    geocode_result = WebGeocodeUtil.get_ll(combined_address)
    coordinates = geocode_result.get("coordinates", {"x": 0, "y": 0})
    x = coordinates.get("x", 0)
    y = coordinates.get("y", 0)

    # print removed

    start_date_string = pyodide_results_from_text_file.get("overall_start_date")
    end_date_string = pyodide_results_from_text_file.get("overall_end_date")

    if not isinstance(start_date_string, str) or not isinstance(end_date_string, str):
        raise ValueError("Start date or end date is missing or invalid")

    today = datetime.today()
    two_years_ago = today.replace(year=today.year - 2)

    try:
        start_date = datetime.fromisoformat(start_date_string)
    except Exception:
        # print removed
        start_date = two_years_ago

    try:
        end_date = datetime.fromisoformat(end_date_string)
    except Exception:
        # print removed
        end_date = today

    def format_date_string(date: datetime) -> str:
        return date.date().isoformat()
        # print removed

    weather_data = WebWeatherUtil.get_that_weatha_data(
        longitude=x,
        latitude=y,
        start_date=format_date_string(start_date),
        end_date=format_date_string(end_date),
    )
    # print removed
    if weather_data is None:
        raise RuntimeError("Weather data failed to fetch")

    dates_from_tiwd = [
        d.date().isoformat() if isinstance(d, datetime) else str(d)
        for d in weather_data["dates"]
    ]
    # print removed
    converted_dates_tiwd: TemperatureInputDataConverted = {
        "dates": dates_from_tiwd,
        "temperatures": weather_data["temperatures"],
    }
    # print removed

    return {
        "convertedDatesTIWD": converted_dates_tiwd,
        "state_id": geocode_result.get("state_id"),
        "county_id": geocode_result.get("county_id"),
        "coordinates": coordinates,
        "addressComponents": geocode_result.get("addressComponents"),
    }
