from rules_engine import helpers

async def executeLookupDesignTempToDisplay(
    coordinates
):
    coordinatesFromJs = coordinates.to_py()
    latitude = coordinatesFromJs.get("y")
    longitude = coordinatesFromJs.get("x")

    start_date, end_date = helpers.get_date_range(30)

    design_temp, elapsed = await helpers.calculate_design_temperature(
        latitude, longitude, start_date, end_date
    )

    # changed the return value to be design temperature and elapsed
    return design_temp, elapsed
