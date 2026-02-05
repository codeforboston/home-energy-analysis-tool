from rules_engine import helpers

def executeLookupDesignTempToDisplay(
    state_id, county_id
):
    return helpers.get_design_temp(state_id, county_id)
