**Goal**: Help heat pump survey teams pick the right heat pump size for a given house. This app would help calculate how many BTUs/hr a house needs in its particular geographical location. Eventually, the tool should store the data for each home to analyze general trends.

**Users**: Teams like the Heatsmart Alliance coaches via the [sibling project](https://github.com/codeforboston/urban-league-heat-pump-accelerator).

**Current method**: Excel spreadsheets with formulas that make the calculations. The current spreadsheet inputs include things like historic energy usage, current house thermostat settings, and yearly weather in the house's zipcode. See [this Slack message](https://cfb-public.slack.com/archives/C0563F96JSG/p1684285954706029) to download a Zip file of that original Excel, or make a request for a copy from HeatSmart at [this link](https://heatsmartalliance.org/coaching-tools/heat-load-analysis/):

## Ideas for Teams

### UI/UX and/or Design
This team will work with the other teams to match the interface and necessary research together.

### Frontend

This team will plan and build the user interface. Possible solutions span Vue and React, Figma or your other favorite tools. It will also get information from the weather station API that the rules engine can use for its calculations. In future, it may work on permissions and persistence of household data.

### Rules Engine 
This team will help convert or read the existing spreadsheet logic into something the app can act upon. Possible solutions span Rust and Data Python: may run in-browser rather than on backend.

### Auth/Persistence

This team will determine the best way to allow users to store their past cases with the households they visit. Possible solutions span Django, Auth0, and Firebase.

