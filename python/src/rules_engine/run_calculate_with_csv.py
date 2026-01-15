import json
import os
import sys

from rules_engine.calculate import calculate_from_csv

# Path to the CSV file (relative to this script or absolute)
csv_path = os.path.join(os.path.dirname(__file__), "alternate.csv")

# Example form_data; adjust as needed for your use case
form_data = {
    "street_address": "1 Broadway",
    "city": "Cambridge",
    "state": "MA",
    "living_area": 2000,
    "fuel_type": "GAS",
    "heating_system_efficiency": 0.85,
    "thermostat_set_point": 68,
    "setback_temperature": 60,
    "setback_hours_per_day": 8,
    "design_temperature": -5,
}

if not os.path.exists(csv_path):
    print(f"CSV file not found: {csv_path}")
    sys.exit(1)

with open(csv_path, "r") as f:
    csv_data = f.read()

result = calculate_from_csv(csv_data, form_data)
print(result)
