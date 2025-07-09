from rules_engine import engine, parser
from rules_engine.pydantic_models import HeatLoadInput


def all_natural_gas_data(form_data, temperature_input, csv_data):
    # We will just pass in this data
    natural_gas_input_records = parser.parse_gas_bill(csv_data)

    heat_load_input = HeatLoadInput(
        living_area=form_data["living_area"],
        fuel_type=form_data["fuel_type"],
        heating_system_efficiency=form_data["heating_system_efficiency"],
        thermostat_set_point=form_data["thermostat_set_point"],
        setback_temperature=form_data.get("setback_temperature"),
        setback_hours_per_day=form_data.get("setback_hours_per_day"),
        design_temperature=form_data["design_temperature"],
    )

    outputs = engine.outputs_natural_gas(
        heat_load_input=heat_load_input,
        temperature_input=temperature_input,
        natural_gas_billing_input=natural_gas_input_records,
    )
    return outputs.model_dump(mode="json")
