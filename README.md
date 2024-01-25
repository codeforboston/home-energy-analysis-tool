This Is Michael's!
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

This team will help convert or read the existing spreadsheet logic into something the app can act upon. Uses numpy and Python: likely to run in-browser rather than on backend.

### Auth/Persistence

This team will determine the best way to allow users to store their past cases with the households they visit. Likely to use SQLite and Prisma in [Epic Stack](https://github.com/epicweb-dev/epic-stack).

### Installation

To install the front end, see this [README.md](https://github.com/codeforboston/home-energy-analysis-tool/blob/main/heat-stack/README.md)
