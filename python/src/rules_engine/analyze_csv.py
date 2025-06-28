"""
TODO: Add module description
"""

from __future__ import annotations

from datetime import datetime, timedelta

from . import engine, parser

# Replace this with your real geocode + weather module
from .geocode_utils import GeocodeUtil
from .get_analytics import get_analytics
from .weather_utils import WeatherUtil


def parse_and_analyze_csv(csv_data: str, form_data: dict[str, str]) -> an:
    try:
        parsed_gas_data = parser.parse_gas_bill(csv_data)
    except Exception as e:
        return {"error": "Error parsing.", "detail": str(e)}

    # --- Validate and fix start/end dates ---
    try:
        start_date = parsed_gas_data.overall_start_date
        end_date = parsed_gas_data.overall_end_date
        # Format as yyyy-mm-dd strings
        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")
    except Exception as e:
        return {"error": "Date handling.", "detail": str(e)}

    # --- Parse address and fetch geo info ---
    try:
        street_address = form_data["street_address"] 
        city = form_data["city"]
        state = form_data["state"]
        full_address = street_address + ", " + city + ", " + state
        geo_result = GeocodeUtil.get_ll(full_address)
    except Exception as e:
        return {"error": "Error parsing.", "detail": str(e)}
    if geo_result is None:
        return {"error": "Unable to get geo info."}


    # --- Fetch weather info ---
    try:
        weather_result = WeatherUtil.get_that_weatha_data(
            longitude=geo_result.coordinates["x"],
            latitude=geo_result.coordinates["y"],
            start_date=start_date_str,
            end_date=end_date_str,
        )
    except Exception as e:
        return {"error": "Problem getting weather data", "detail": str(e)}

    # --- Run rules engine ---
    try:
        form_data["name"] = f"{form_data['name']}'s home"
        result = get_analytics(form_data, weather_result, csv_data)
    except Exception as e:
        return {"error": "Error analyzing.", "exception": str(e)}

    temperatures_str = weather_result.temperatures.map(t => str(t))
        "temperatures": [],
        "dates": [],
    }
    return {
        "convertedDatesTIWD": weather_result_json,
        "state_id": geo_result.state or "",
        "county_id": geo_result.county_id or "",
        "analysisResults": result or "",
    }


def main():
    # Provide your input file path here
    csv_file_path = "./rules_engine/alternate.csv"

    # Load CSV text
    with open(csv_file_path, "r", encoding="utf-8") as f:
        csv_text = f.read()

    # Provide form data here - fill these in as needed

    form_data = {
        "street_address": "15 Main St",
        "city": "Glouceter",
        "state": "MA",
        "name": "Ethan",  # Your name or user's name,,
        "living_area": 2200,
        "fuel_type": "GAS",
        "heating_system_efficiency": 97,
        "thermostat_set_point": 68,
        "setback_temperature": 65,
        "setback_hours_per_day": 8,
        "design_temperature": 60,
    }

    # Call the analysis function
    return parse_and_analyze_csv(csv_text, form_data)



if __name__ == "__main__":
    main()
