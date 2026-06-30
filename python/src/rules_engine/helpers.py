import csv
import pathlib
import time
import statistics
import urllib.parse
import urllib.request
import json
from datetime import date

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


def get_design_temp(state_id: str, county_id: str) -> int:
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


# TO-DO: Fix these functions to use for the calculate design temp
"""async def _urlopenpyfetch(url):
    from pyodide.http import pyfetch
    response = await pyfetch(url)
    return await response.bytes()
"""


def _urlopen(url):
    try:
        from pyodide.http import open_url  # type: ignore[import]

        return open_url(url).read()
    except ImportError:
        # Fallback for non-Pyodide environments (e.g. running tests in CPython)
        with urllib.request.urlopen(url) as r:
            return r.read()


def get_date_range(years_back, end_date=date(2025, 12, 31)):
    """
    Return the start date and the end_date for a given number of years back
    """

    # ex: 2025 - 9 years + 1, 1, 1
    start_date = date(end_date.year - years_back + 1, 1, 1)

    return start_date.isoformat(), end_date.isoformat()


def calculate_design_temperature(lat, lon, start_date, end_date):
    """
    Fetch hourly temperatures from Open-Meteo's archive API
    """

    # start time duration
    start_time = time.time()

    # Build the query parameters as a dict
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": "temperature_2m",
        "temperature_unit": "fahrenheit",
    }

    # Turn the dict into a URL query string like "latitude=42.46&longitude=-71.27&..."
    query_string = urllib.parse.urlencode(params)
    url = f"https://archive-api.open-meteo.com/v1/archive?{query_string}"

    raw_data = _urlopen(url)

    # Parse the JSON text into a Python dict
    data = json.loads(raw_data)

    # Pull out the list of temperatures
    data = data["hourly"]["temperature_2m"]

    # Compute the 1st percentile (no pandas)
    design_temp = statistics.quantiles(data, n=100)[0]

    # calculate total time to compute function
    elapsed = time.time() - start_time

    # return all values
    return design_temp, elapsed
