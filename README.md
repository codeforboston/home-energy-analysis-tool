**Starting point**: Spreadsheet with logic for helping survey teams, like Heatsmart Alliance coaches via the [sibling project](https://github.com/codeforboston/urban-league-heat-pump-accelerator), to select an appropriately sized heat pump unit (by BTU/hr) for a given household. Current spreadsheet inputs include things like historic energy usage, household thermostat setting, and yearly weather in their zipcode.

This app is based on Excel spreadsheet formulas. See [this Slack message](https://cfb-public.slack.com/archives/C0563F96JSG/p1684285954706029) to download a Zip file of that original Excel, or make a request for a copy from HeatSmart at [this link](https://heatsmartalliance.org/coaching-tools/heat-load-analysis/):

**Desired**: "Help the helpers" app which assists the heat pump survey teams to fill an app version of the spreadsheet. Eventually, the tool should persist a home profile for aggregation or later reference.

## Ideas for Teams


### UI/UX and/or Design
This team will work with the other teams to match the interface and necessary research together.

### Frontend

This team will plan and build the user interface. Possible solutions span Vue and React, Figma or your other favorite tools. 

### Rules Engine 
This team will help convert or read the existing spreadsheet logic into something the app can act upon. Possible solutions span Rust and Data Python: may run in-browser rather than on backend.

### Auth/Persistence

This team will determine the best way to allow users to store their past cases with the households they visit. Possible solutions span Django, Auth0, and Firebase.

Oh hey it's a change