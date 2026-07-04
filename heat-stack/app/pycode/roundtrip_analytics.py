from rules_engine import ProcessedEnergyBillInput, TemperatureInput, engine, helpers
from rules_engine.pydantic_models import HeatLoadInput


async def executeRoundtripAnalyticsFromForm(
    summaryInputJs, temperatureInputJs, userAdjustedData, coordinates, state_id, county_id
):
    """
    "processed_energy_bills" is the "roundtripping" parameter to be passed as userAdjustedData.
    """
    print("🔧 executeRoundtripAnalyticsFromForm called from server")
    print(f"📊 Input data - state_id: {state_id}, county_id: {county_id}")

    summaryInputFromJs = summaryInputJs.as_object_map().values()._mapping
    temperatureInputFromJs = temperatureInputJs.as_object_map().values()._mapping

    coordinatesFromJs = coordinates.to_py()
    latitude = coordinatesFromJs.get("y")
    longitude = coordinatesFromJs.get("x")

    start_date, end_date = helpers.get_date_range(30)
    
    # expect 1 for middlesex county:  print("design temp check ",design_temp_looked_up, state_id, county_id)
    if summaryInputFromJs.get("design_temperature_override") == None:
        design_temp, elapsed = await helpers.calculate_design_temperature(
            latitude, longitude, start_date, end_date
        )
        print("The weather design temp was found! " + str(design_temp) + " " + str(elapsed))
    else:
        design_temp = summaryInputFromJs.get("design_temperature_override")

    summaryInput = HeatLoadInput(
        **summaryInputFromJs, design_temperature=design_temp
    )

    temperatureInput = TemperatureInput(**temperatureInputFromJs)

    # third step, re-run of the table data
    # Convert JsProxy to Python dict if needed
    if hasattr(userAdjustedData, "to_py"):
        userAdjustedData = userAdjustedData.to_py()

    userAdjustedDataFromJsToPython = [
        ProcessedEnergyBillInput(**record)
        for record in userAdjustedData["processed_energy_bills"]
    ]
    # print("py", userAdjustedDataFromJsToPython[0])

    print(
        f"🧮 Calling engine.get_outputs_normalized with {len(userAdjustedDataFromJsToPython)} billing records"
    )
    outputs2 = engine.get_outputs_normalized(
        summaryInput, None, temperatureInput, userAdjustedDataFromJsToPython
    )

    # print("py2", outputs2.processed_energy_bills[0])
    print("✅ Recalculation completed successfully on server")
    return outputs2.model_dump(mode="json")
