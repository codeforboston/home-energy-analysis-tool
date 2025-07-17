from rules_engine import parser
from rules_engine.pydantic_models import (
    FuelType,
    HeatLoadInput,
    TemperatureInput
)
from rules_engine import engine, helpers

def get_analytics(form_data, temperature_input, csv_data):
    """
    second step: this will be the first time to draw the table
    # two new geocode parameters may be needed for design temp:
    # watch out for helpers.get_design_temp( addressMatches[0].geographies.counties[0]['STATE'] , addressMatches[0].geographies.counties[0]['COUNTY'] county_id) 
    # in addition to latitude and longitude from GeocodeUtil.ts object .
    # pack the get_design_temp output into heat_load_input
    """
    
    # We will just pass in this data
    natural_gas_input_records = parser.parse_gas_bill(csv_data)

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


    outputs = engine.get_outputs_natural_gas(heat_load_input=heat_load_input, temperature_input=temperature_input, natural_gas_billing_input=natural_gas_input_records)
    return outputs.model_dump(mode="json")