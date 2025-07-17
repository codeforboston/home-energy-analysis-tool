from rules_engine import engine, helpers, parser
from rules_engine.pydantic_models import (
    FuelType,
    HeatLoadInput,
    ProcessedEnergyBillInput,
    TemperatureInput,
)


def executeRoundtripAnalyticsFromForm(
    summaryInputJs, temperatureInputJs, userAdjustedData, state_id, county_id
):
    """
    "processed_energy_bills" is the "roundtripping" parameter to be passed as userAdjustedData.
    """

    summaryInputFromJs = summaryInputJs.as_object_map().values()._mapping
    temperatureInputFromJs = temperatureInputJs.as_object_map().values()._mapping

    design_temp_looked_up = helpers.get_design_temp(state_id, county_id)
    # expect 1 for middlesex county:  print("design temp check ",design_temp_looked_up, state_id, county_id)
    summaryInput = HeatLoadInput(
        **summaryInputFromJs, design_temperature=design_temp_looked_up
    )

    temperatureInput = TemperatureInput(**temperatureInputFromJs)

    # third step, re-run of the table data
    userAdjustedDataFromJsToPython = [
        ProcessedEnergyBillInput(**record)
        for record in userAdjustedData["processed_energy_bills"]
    ]
    # print("py", userAdjustedDataFromJsToPython[0])

    outputs2 = engine.get_outputs_normalized(
        summaryInput, None, temperatureInput, userAdjustedDataFromJsToPython
    )

    # print("py2", outputs2.processed_energy_bills[0])
    return outputs2.model_dump(mode="json")
