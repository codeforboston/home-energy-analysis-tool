from rules_engine import parser
from rules_engine.pydantic_models import (
    FuelType,
    HeatLoadInput,
    TemperatureInput
)
from rules_engine import engine, helpers

def get_analytics(summary_input, temperature_input, csv_data, state_id, county_id):
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


    outputs = engine.get_outputs_natural_gas(summary_input=summary_input, temperature_input=temperature_input, natural_gas_billing_input=natural_gas_input_records)
    return outputs.model_dump(mode="json")