**Goal**: Provide an app that helps residential energy coaches or advocates, and some homeowners, estimate a home's heating requirements (heat load) and assess whether proposed heat pumps have sufficient heating capacity for the home. The app will use information about the home including it's location, usual thermostat settings, and historical energy usage, provided by the resident, to calculate the heating requirements in BTUs/hr. Key outputs will include two graphs, one showing the heating requirement vs. outdoor temperature and another comparing the home with other homes based on floor area. In the future, this app may be extended to provide more information, such an estimate of electricity use by a heat pump, cost of heating with a heat pump vs. fossil fuel and other such features.

**Users**: [Heatsmart Alliance coaches](https://heatsmartalliance.org/about-our-volunteer-coaches/), energy coaches with other affiliations, and users of the CfB [sibling project](https://github.com/codeforboston/urban-league-heat-pump-accelerator).

**Current method**: An Excel spreadsheet with formulas that perform the calculations. Inputs to the existing spreadsheet include historic energy usage, typical thermostat settings, and temperature data from a weather station close to the home. More info on this existing spreadsheet and a link to request a download are available from the HeatSmart Alliance at [this link](https://heatsmartalliance.org/coaching-tools/heat-load-analysis/).

## Teams

### UI/UX and/or Design

This team will work with the other teams to match the interface and necessary research together.

### JavaScript

This team will plan and build the user interface. React and Remix in [Epic Stack](https://github.com/epicweb-dev/epic-stack). Uses Pyodide to run python code on frontend.
It will also get information from the weather station API that the rules engine can use for its calculations. In the future, it may work on permissions and persistence of household data.

### Rules Engine

Rules engine provides reading, validation and calculations for heat data that are read from the 2 gas companies National Grid and Eversource. https://docs.google.com/document/d/1-CAsHL1WhCPQW8iXA_XXgSUWHZsCKiTsPHOVz9eV0AE/edit?tab=t.0

Definitions:
    
    Balance point: Outdoor temperature beyond which no heating is required.
    Inclusion code: winter=1|spring=0|summer=-1|fall=0( determines the months to be used for heat load calculations)
    Thermostat set point: the temp in F at which the home is normally set.
    setback_temperature: temp in F at which the home is set during  off hours.
    setback_hours_per_day: average # of hours per day the home is at setback temp.
    design_set_point: a standard internal temperature / thermostat it can be read for a county from helpers.py.
    set point - different from the preferred set point of an individual homeowner.
    avg_indoor_temp: average indoor temperature on a given day 
    `((24 - setback_hours_per_day) * thermostat_set_point + setback_hours_per_day * setback_temperature) / 24`
    design_temp: an outside temperature that represents one of the coldest days of the year for the given location of a home.
    ua: the heat transfer coefficient
    hdd: heating degree days on a given day for a given home `(Balance Point-avg_indoor_temp)`.
    dhw: heat used for non heating purposes.
    maximun heat load: `(design_set_point - design_temp) * ua`

Calculations:
    
    The data files for each home is used to calculate the heat load for the home irrespective of the fuel type used. The data is normalized to be fuel type agnostic and the intermediate bill that is generated converts temperature data and billing period inputs into internal classes used for heat loss calculations.

Validations:
    1. Validate the csv for the heating company National Gird/Eversource

Tests:
    Tests for Engine:
        1. Generating intermediate bill
        2. Generating Normalized bill
        3. Calculate Non heating usage

    Tests for Parser:
        1. Identify gas company
        2. Error of neither of the 2 Nation Grid/ Eversource
        
### Auth/Persistence

This team will determine the best way to allow users to store their past cases with the households they visit. Likely to use SQLite and Prisma in [Epic Stack](https://github.com/epicweb-dev/epic-stack).

### Installation

To install the front end, see this [README.md](https://github.com/codeforboston/home-energy-analysis-tool/blob/main/heat-stack/README.md)

### Documentation
For the Heat Stack (Javascript) portion read: [README.md](https://github.com/codeforboston/home-energy-analysis-tool/blob/main/heat-stack/README.md)
For the Rules Engine (Python) portion read: [README.md](https://github.com/codeforboston/home-energy-analysis-tool/blob/main/python/README.md)
