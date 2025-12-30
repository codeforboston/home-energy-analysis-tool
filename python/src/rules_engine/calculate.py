"""
TODO: Add module description
"""

from __future__ import annotations

from datetime import datetime, timedelta

from rules_engine import engine, parser

from .pydantic_models import HeatLoadInput

# Replace this with your real geocode + weather module
from .web_geocode_utils import WebGeocodeUtil
from .web_weather_utils import WebWeatherUtil


def calculate_from_csv(csv_data: str, form_data: dict) -> dict:
    try:
        print("debug csv", csv_data)
        parsed_gas_data = parser.parse_gas_bill(csv_data)
        print("debug done")
    except Exception as e:
        return {"errors": {"parsing": str(e)}}
    return calculate_from_parsed_bills(parsed_gas_data, form_data)


def calculate_from_parsed_bills(parsed_gas_data: str, form_data: dict) -> dict:
    # --- Validate and fix start/end dates ---
    # Derive start and end dates from billing records
    from .pydantic_models import NaturalGasBillingInput

    # Convert dict/JSON to Pydantic model
    gas_data_model = NaturalGasBillingInput.parse_obj(parsed_gas_data)
    billing_records = gas_data_model.records
    start_date = min(r.period_start_date for r in billing_records)
    end_date = max(r.period_end_date for r in billing_records)
    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")

    # --- Geocode and fetch weather ---
    street_address = form_data["street_address"]
    city = form_data["city"]
    state = form_data["state"]
    full_address = street_address + ", " + city + ", " + state
    geo_result = WebGeocodeUtil.get_ll(full_address)
    # print removed
    weather_result = WebWeatherUtil.get_that_weatha_data(
        longitude=geo_result.coordinates["x"],
        latitude=geo_result.coordinates["y"],
        start_date=start_date_str,
        end_date=end_date_str,
    )
    # print removed

    # We will just pass in this data
    # print removed

    # design_temp_looked_up = helpers.get_design_temp(state_id, county_id)
    # summaryInput = HeatLoadInput(**summaryInputFromJs, design_temperature=design_temp_looked_up)
    heat_load_input = HeatLoadInput(
        living_area=form_data["living_area"],
        fuel_type=form_data["fuel_type"],
        heating_system_efficiency=form_data["heating_system_efficiency"],
        thermostat_set_point=form_data["thermostat_set_point"],
        setback_temperature=form_data.get("setback_temperature"),
        setback_hours_per_day=form_data.get("setback_hours_per_day"),
        design_temperature=form_data["design_temperature"],
    )
    # print removed

    result = engine.get_outputs_natural_gas(
        heat_load_input=heat_load_input,
        temperature_input=weather_result,
        natural_gas_billing_input=parsed_gas_data,
    )

    return {
        "convertedDatesTIWD": weather_result,
        "state_id": geo_result.state,
        "county_id": geo_result.county_id,
        "analysisResults": result,
    }


def main():
    # Provide your input file path here
    csv_file_path = "alternate.csv"

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
    result = calculate_from_csv(csv_text, form_data)

    # Print removed
    print("Analysis Result:", result)


if __name__ == "__main__":
    main()
