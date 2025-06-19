"""
TODO: Add module description
"""

from __future__ import annotations
from datetime import datetime, timedelta
from . import parser, engine

# Replace this with your real geocode + weather module
from .geocode_utils import GeocodeUtil
from .weather_utils import WeatherUtil

def analyze_energy_case(csv_data: str, form_data: dict) -> dict:
    try:
        parsed_gas_data = parser.parse_gas_bill(csv_data)
    except Exception as e:
        return {"errors": {"parse": str(e)}}

    # --- Validate and fix start/end dates ---
    try:
        start_date_str = parsed_gas_data.overall_start_date
        end_date_str = parsed_gas_data.overall_end_date

        today = datetime.today()
        two_years_ago = today - timedelta(days=730)

        try:
            start_date = datetime.fromisoformat(start_date_str)
        except:
            print("Invalid start date, defaulting to 2 years ago")
            start_date = two_years_ago

        try:
            end_date = datetime.fromisoformat(end_date_str)
        except:
            print("Invalid end date, defaulting to today")
            end_date = today

        # Format as yyyy-mm-dd strings
        start_date_str = start_date.strftime('%Y-%m-%d')
        end_date_str = end_date.strftime('%Y-%m-%d')

    except Exception as e:
        return {"errors": {"date_handling": f"Date error: {str(e)}"}}

    # --- Geocode and fetch weather ---
    try:
        street_address = form_data["street_address"]
        city = form_data["city"]
        state = form_data["state"]
        full_address = street_address + ", " + city +", "+state
        geo_result = GeocodeUtil.get_ll(full_address)
    except(e):
        raise ValueError("Unable to get address")
     

    try:
        weather_result = WeatherUtil.get_that_weatha_data(
            longitude = geo_result.coordinates.x,
            latitude = geo_result.coordinates.y,
            start_date = start_date_str,
            end_date = end_date_str      
        )
    except Exception as e:
        return {"errors": {"geo_weather": str(e)}}

    # --- Run rules engine ---
    try:
        form_data["name"] = f"{form_data['name']}'s home"
        result = engine.get_analytics_from_form(
            form_fields=form_data,
            converted_dates_tiwd=weather_result["convertedDatesTIWD"],
            csv_data=csv_data,
            state_id=geo_result["state_id"],
            county_id=geo_result["county_id"],
        )
    except Exception as e:
        return {"errors": {"engine": str(e)}}

    return {
        "convertedDatesTIWD": geo_result["convertedDatesTIWD"],
        "state_id": geo_result["state_id"],
        "county_id": geo_result["county_id"],
        "analysisResults": result,
    }

def main():
    # Provide your input file path here
    csv_file_path = "./rules_engine/alternate.csv"

    # Load CSV text
    with open(csv_file_path, "r", encoding="utf-8") as f:
        csv_text = f.read()

    # Provide form data here - fill these in as needed
    form_data = {
        "street_address": "1 Broadway",
        "city": "Cambridge",
        "state": "MA",
        "name": "Ethan"  # Your name or user's name
    }

    # Call the analysis function
    result = analyze_energy_case(csv_text, form_data)

    # Print results (or handle them as needed)
    print(result)


if __name__ == "__main__":
    main()

