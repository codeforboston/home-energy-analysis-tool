import csv
import pathlib

DESIGN_TEMP_DIR = pathlib.Path(__file__).parent.parent / "data"
DESIGN_TEMP_FILE = DESIGN_TEMP_DIR / "merged_structure_temps.csv"

# Function to take in stateId & countyId
# Will open merged_stucture_temps.csv to lookup design_tmp using the (state_id, county_id) composite key

# {("12", "017"): 9}
_DESIGN_TEMPS = None


def _load_design_temps():
    global _DESIGN_TEMPS

    _DESIGN_TEMPS = {}

    with open(DESIGN_TEMP_FILE) as f:
        reader = csv.DictReader(f)
        for row in reader:
            current_state_id = row["state_id"]
            current_county_id = row["county_fp"]
            key = (current_state_id, current_county_id)
            value = row["county_design_temp"]
            _DESIGN_TEMPS[key] = value


def get_design_temp(state_id: str, county_id: str) -> str:
    global _DESIGN_TEMPS

    if _DESIGN_TEMPS is None:
        _load_design_temps()

    key = (state_id, county_id)
    if _DESIGN_TEMPS is not None:
        design_temp = _DESIGN_TEMPS.get(key)
    if design_temp is None:
        raise ValueError(
            f"Lookup for state_id '{state_id}' and county_id '{county_id}' was not found. "
            "Ensure that the ids are valid and that design temperature data is up to date."
        )

    return int(design_temp)
