import csv
import json
import os
import pathlib
from pydantic import BaseModel
from typing import List
import requests
from requests import Response
import io

DESIGN_TEMP_DIR = pathlib.Path(__file__).parent / ".." / ".." / "design_temp"
CENSUS_DOCS_BASE_URL = "https://www2.census.gov/geo/docs/reference"
CENSUS_STATE_PATH = "/state.txt"
CENSUS_COUNTY_PATH = "/codes2020/national_county2020.txt"
CENSUS_DELIMETER = '|'
NEW_LINE = '\n'
NEW_HEADERS=["state_id","state_name","state_abbr","county_fp","county_ns","county_name","county_design_temp"]

class State(BaseModel):
    state_id: str
    state_abbr: str
    state_name: str

#STATE(the 2 letter abbr)|STATEFP(the id)|COUNTYFP(3 digit code)|COUNTYNS(8digit unique)|COUNTYNAME
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
_design_temp={}
def load_design_temp_data():
    result = {}

    with open(DESIGN_TEMP_DIR / "design_temp_by_county.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
            item = DTBC(
                state=row["state"], county=row["county"],temp=row["design_temp"]
            )
            if row["state"] in result:
                # result[row["state"]].append(row["county"])
                result[row["state"]].append(item) 
            else:
                # result[row["state"]] = [row["county"]]
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
    


    # this way sucks. would need to loop over each county when combining with states values.
    # for row in reader:
    #     item = County(
    #         state_id=row["STATEFP"], county_fp=row["COUNTYFP"], county_ns=row["COUNTYNS"],county_name=row["COUNTYNAME"]
    #     )
    #     ret.append(item)
    # return ret
    
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
    # This way blows. maybe a dict instead
    # for row in reader:
    #     item = State(
    #         state_id=row["STATE"], state_abbr=row["STUSAB"], state_name=row["STATE_NAME"]
    #     )
    #     ret.append(item)
    # return ret
    # return process(response)

    # woof, no need for this. just use fancy dictreader on response text property.
    # token_count = start_p = end_p = idx = 0
    # line = []
    
    # for c in response.iter_content():
    #     line.append(c)
    #     if c == CENSUS_DELIMETER:
    #         token_count += 1
    #     elif c == NEW_LINE:
    #         token_count = start_p = end_p = 0

        


states = fetch_census_states()
counties = fetch_census_counties()
# print(_counties)
dtbc = load_design_temp_data()
# print(dtbc)
with open("merged_structure_temps.csv", "w", newline="") as oFile:
    writer = csv.DictWriter(oFile, fieldnames=NEW_HEADERS)
    writer.writeheader()
    for s, cbs in _counties.items():
        # print(f"S: {s} => CBS: {cbs}")
        for d in dtbc[s]:
            for c in cbs:
                if d.county in c.county_name:
                    ostr=f"{c.state_id},{s},{c.state_abbr},{c.county_fp},{c.county_ns},{d.county}"
                    print(ostr) # Writer here
        # exit()
#avoid all this bs by doing it in the counties fetch
# intermediate=[]
# for id,state in states.items():
#     print(_counties[id])
#     for c in _counties[id]:
#         print(str(c.state_id))
#     exit()
    # for county in counties