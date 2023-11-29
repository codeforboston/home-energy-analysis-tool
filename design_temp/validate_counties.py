import csv
import pathlib
from pydantic import BaseModel
import requests
import io

DESIGN_TEMP_DIR = pathlib.Path(__file__).parent
CENSUS_DOCS_BASE_URL = "https://www2.census.gov/geo/docs/reference"
CENSUS_STATE_PATH = "/state.txt"
CENSUS_COUNTY_PATH = "/codes2020/national_county2020.txt"
CENSUS_DELIMETER = '|'
NEW_LINE = '\n'
NEW_HEADERS="state_id,state_name,state_abbr,county_fp,county_ns,county_name,county_design_temp"

class State(BaseModel):
    state_id: str
    state_abbr: str
    state_name: str

class County(BaseModel):
    state_id: str
    state_abbr: str
    state_name: str
    county_fp: str
    county_ns: str
    county_name: str

class DTBC(BaseModel):
    state: str
    county: str
    temp: int

_counties = {}
_states={}
def load_design_temp_data():
    result = {}

    with open(DESIGN_TEMP_DIR / "design_temp_by_county.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
            item = DTBC(
                state=row["state"], county=row["county"],temp=row["design_temp"]
            )
            if row["state"] in result:
                result[row["state"]].append(item) 
            else:
                result[row["state"]] = [item]
            
            

    return result

def fetch_census_counties():
    census_url = CENSUS_DOCS_BASE_URL + CENSUS_COUNTY_PATH

    response = requests.get(census_url)
    ret = {}
    reader = csv.DictReader(f=io.StringIO(response.text),delimiter=CENSUS_DELIMETER)

    for row in reader:
        sid = row["STATEFP"]
        sn = _states[sid].state_name
        item = County(
            state_id=sid, state_abbr=_states[sid].state_abbr, state_name=sn,county_fp=row["COUNTYFP"], county_ns=row["COUNTYNS"],county_name=row["COUNTYNAME"]
        )
        _counties[sn].append(item)
    
def fetch_census_states():
    states_url = CENSUS_DOCS_BASE_URL + CENSUS_STATE_PATH

    response = requests.get(states_url)
    reader = csv.DictReader(f=io.StringIO(response.text),delimiter=CENSUS_DELIMETER)

    for row in reader:
        _counties[row["STATE_NAME"]] = []
        item = State(
            state_id=row["STATE"], state_abbr=row["STUSAB"], state_name=row["STATE_NAME"]
        )
        _states[row["STATE"]] = item
    return _states


states = fetch_census_states()
counties = fetch_census_counties()

dtbc = load_design_temp_data()

with open(DESIGN_TEMP_DIR / "merged_structure_temps.csv", "w", newline="\n") as oFile:
    oFile.write(NEW_HEADERS)
    for s, cbs in _counties.items():
        d_row = dtbc.get(s)
        if d_row:
            for d in d_row:
                for c in cbs:
                    if d.county in c.county_name:
                        ostr=f"\n{c.state_id},{s},{c.state_abbr},{c.county_fp},{c.county_ns},{d.county},{d.temp}"
                        oFile.write(ostr)