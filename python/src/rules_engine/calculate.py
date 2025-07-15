"""
TODO: Add module description
"""

from __future__ import annotations
from datetime import datetime, timedelta
from . import parser, engine
from . import parser, engine

# Replace this with your real geocode + weather module
from .geocode_utils import GeocodeUtil
from .weather_utils import WeatherUtil
from .get_analytics import get_analytics
from .pydantic_models import HeatLoadInput

def calculate(csv_data: str, form_data: dict) -> dict:
    try:
        print("debug csv", csv_data)
        parsed_gas_data = parser.parse_gas_bill(csv_data)
        print("debug done")
    except Exception as e:
        return {"errors": {"parse": str(e)}}

    # --- Validate and fix start/end dates ---
    try:
        start_date = parsed_gas_data.overall_start_date
        end_date = parsed_gas_data.overall_end_date   
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
    except:
        raise ValueError("Unable to get address")
     
    print("geo_result",  geo_result.coordinates["x"],
            geo_result.coordinates["y"],
            start_date_str,
            type(start_date_str)   )
    try:
        weather_result = WeatherUtil.get_that_weatha_data(
            longitude = geo_result.coordinates["x"],
            latitude = geo_result.coordinates["y"],
            start_date = start_date_str,
            end_date = end_date_str      
        )

    except Exception as e:
        print("debug exception")
        return {"errors": {"geo_weather": str(e)}}
    print("debug", weather_result)
    print("debug 2", geo_result)

    # --- Run rules engine ---
    try:
        form_data["name"] = f"{form_data['name']}'s home"
        result = get_analytics(
            form_data, weather_result, csv_data
        )
    except Exception as e:
        raise e

    return {
        "convertedDatesTIWD": weather_result,
        "state_id": geo_result.state,
        "county_id": geo_result.county_id,
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
        "street_address": "15 Main St",
        "city": "Glouceter",
        "state": "MA",
        "name": "Ethan",  # Your name or user's name,,
        "living_area":2200,
        "fuel_type": "GAS" ,
        "heating_system_efficiency": 97,
        "thermostat_set_point": 68,
        "setback_temperature": 65,
        "setback_hours_per_day":8,
        "design_temperature": 60,
    }

    # Call the analysis function
    result = analyze_energy_case(csv_text, form_data)

    # Print results (or handle them as needed)
    print(result)


if __name__ == "__main__":
    main()

