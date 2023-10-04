import csv
import re
from dataclasses import dataclass


# This script generates design_temp_by_county.csv
# from the raw text copied from the ENERGY STAR pdf located at:
# https://www.energystar.gov/ia/partners/bldrs_lenders_raters/downloads/County%20Level%20Design%20Temperature%20Reference%20Guide%20-%202015-06-24.pdf
# To copy the text from the PDF you can open it in chrome and select the 'print' option
# to save it as a PDF that will allow copying


# Number of counties (according to PDF) for each of the 50 states and for DC
# Same order as PDF
REGIONS = {
    "Alaska": 28,
    "Alabama": 67,
    "Arkansas": 75,
    "Arizona": 15,
    "California": 58,
    "Colorado": 64,
    "Connecticut": 8,
    "District of Columbia": 1,
    "Delaware": 3,
    "Florida": 67,
    "Georgia": 159,
    "Hawaii": 5,
    "Iowa": 99,
    "Idaho": 44,
    "Illinois": 102,
    "Indiana": 92,
    "Kansas": 105,
    "Kentucky": 120,
    "Louisiana": 64,
    "Massachusetts": 14,
    "Maryland": 24,
    "Maine": 16,
    "Michigan": 83,
    "Minnesota": 87,
    "Missouri": 115,
    "Mississippi": 82,
    "Montana": 56,
    "North Carolina": 100,
    "North Dakota": 53,
    "Nebraska": 93,
    "New Hampshire": 10,
    "New Jersey": 21,
    "New Mexico": 33,
    "Nevada": 17,
    "New York": 62,
    "Ohio": 88,
    "Oklahoma": 77,
    "Oregon": 36,
    "Pennsylvania": 67,
    "Rhode Island": 5,
    "South Carolina": 46,
    "South Dakota": 66,
    "Tennessee": 95,
    "Texas": 254,
    "Utah": 29,
    "Virginia": 134,
    "Vermont": 14,
    "Washington": 39,
    "Wisconsin": 72,
    "West Virginia": 55,
    "Wyoming": 23,
}


def remove_junk(content):
    # remove everything before the table
    table_title = (
        "Exhibit 1: Cooling and Heating Design Temperatures by State and County"
    )
    content = content.split(table_title)[1]
    # remove the title that appears at the top of each page
    pattern = r"[ ]+ENERGY STAR Certified Homes\nCounty-Level Design Temperature Reference Guide"
    content, subs = re.subn(pattern, "", content)
    if subs != 115:
        raise Exception("Wrong number of substitutions: {}".format(subs))
    # remove the column labels from each page (they fit one of two patterns)
    pattern = (
        r"State[\s]+County[\s]+1% Cooling Temperature \(°F\)[\s]+"
        r"99% Heating Temperature \(°F\)[\s]+HDD/CDD Ratio[\s]+"
        r"Weather Station Selected for Cooling Temperature[\s]+"
        r"Reference[\s]+Weather Station Selected for Heating Temperature[\s]+Reference"
    )
    content, subs = re.subn(pattern, "", content)
    if subs != 47:
        raise Exception("Wrong number of substitutions: {}".format(subs))
    pattern = (
        r"1% Cooling State County Temperature\n\(°F\)\n"
        r"99% Heating HDD/CDD Weather Station Selected for "
        r"Weather Station Selected for\nTemperature Ratio Cooling "
        r"Temperature Reference Heating Temperature Reference \(°F\)"
    )
    content, subs = re.subn(pattern, "", content)
    if subs != 69:
        raise Exception("Wrong number of substitutions: {}".format(subs))
    # remove the page numbers that appear at the bottom of each page
    pattern = r"[ ]+Page [0-9]+ of 116"
    content, subs = re.subn(pattern, "", content)
    if subs != 116:
        raise Exception("Wrong number of substitutions: {}".format(subs))
    return content


@dataclass
class DataRow:
    state: str
    county: str
    design_temp: int


def parse(content: str):
    # find where each region starts
    # (it starts at the first instance of the region name appearing twice)
    matches = []
    for r in REGIONS:
        match = re.search(r + r"[\s]*" + r, content)
        if match is None:
            raise Exception("Could not find data for region: {}".format(r))
        matches.append(match)
    # get table rows for each region
    rows = []
    for i, r in enumerate(REGIONS):
        # get the substring of content for a particular region
        end_index = matches[i + 1].start() if i + 1 < len(matches) else len(content)
        r_content = r + content[matches[i].end() : end_index]
        # match region name (state name), county, 1% cooling, 99% heating, and HDD/CDD
        # some weather station names are jumbled, so avoid them
        pattern = r"({})[\s]+([A-Za-z \-\.\']+?)[\s]+[0-9]+[\s]+([\-0-9]+)[\s]+[0-9\.]+"
        pattern = pattern.format(r)
        row_matches = re.findall(pattern, r_content)
        if len(row_matches) != REGIONS[r]:
            s = "found {} rows for {}, expected {}"
            raise Exception(s.format(len(row_matches), r, REGIONS[r]))
        rows += [DataRow(*m) for m in row_matches]
    if len(rows) != sum(REGIONS.values()):
        s = "found {} rows, expected {}"
        raise Exception(s.format(len(rows), sum(REGIONS.values())))
    return rows


if __name__ == "__main__":
    with open("pdf_rawcopy.txt") as f:
        content = f.read()
    content = remove_junk(content)
    rows = parse(content)
    with open("design_temp_by_county.csv", "w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=vars(rows[0]).keys())
        writer.writeheader()
        for r in rows:
            writer.writerow(vars(r))
