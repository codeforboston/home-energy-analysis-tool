"""
Instructions to run this script:

1. Activate your Python environment (if using a virtual environment):
    source /path/to/venv/bin/activate

2. Change directory to the python/src folder:
    cd python/src

3. Run the script using:
    python3 -m rules_engine.run_calculate_with_csv src/example.csv
"""

import argparse
import csv
import os
import pprint
import sys

from rules_engine.calculate_output import calculate_from_csv

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


def doit(key, value):
    print(f"\n=== {key} ===\n", flush=True)
    if key == "processed_energy_bills":
        print("debug processed_energy_bills:", flush=True)
        for i, row in enumerate(value, start=1):
            print(f"{i}:", flush=True)
            pprint.pprint(row, sort_dicts=False)
    elif key == "analysisResults":
        # Hard-coded keys to print in fixed order
        heat_load_output = value.heat_load_output
        processed_energy_bills = value.processed_energy_bills
        balance_point_graph_records = value.balance_point_graph.records
        print("\n--- heat_load_output ---\n", flush=True)
        pprint.pprint(heat_load_output, sort_dicts=False)
        print("\n--- processed_energy_bills ---\n", flush=True)
        for bill in processed_energy_bills:
            if hasattr(bill, "__dict__"):
                bill_dict = vars(bill)
            else:
                bill_dict = bill
            print(", ".join(f"{k}: {v}" for k, v in bill_dict.items()), flush=True)
        print("\n--- balance_point_graph ---\n", flush=True)
        for rec in balance_point_graph_records:
            if hasattr(rec, "__dict__"):
                print("debug a", flush=True)
                rec_dict = vars(rec)
            else:
                print("debug b", flush=True)
                rec_dict = rec
            print(", ".join(f"{k}: {v}" for k, v in rec_dict.items()), flush=True)
    elif key == "convertedDatesTIWD":
        dates = value.dates
        temperatures = value.temperatures
        print("convertedDatesTIWD (date, temperature):", flush=True)
        for date, temp in zip(dates, temperatures):
            print(f"{date}: {temp}", flush=True)
    elif key in ("state_id", "county_id"):
        print(value, flush=True)
    else:
        print("Invald key:", key, flush=True)


def main():
    parser = argparse.ArgumentParser(
        description="Run rules engine calculation with CSV input."
    )
    parser.add_argument("csv_file", help="Path to the input CSV file.")
    args = parser.parse_args()

    csv_file = args.csv_file
    print(f"\n📄 Reading input from: {csv_file}", flush=True)
    with open(csv_file, "r") as f:
        csv_data = f.read()

    print("🔄 Calculating results...", flush=True)

    result = calculate_from_csv(csv_data=csv_data, form_data=form_data)
    print("Calculation result:", flush=True)
    doit("convertedDatesTIWD", result.get("convertedDatesTIWD"))
    doit("state_id", result.get("state_id"))
    doit("county_id", result.get("county_id"))
    doit("analysisResults", result.get("analysisResults"))


if __name__ == "__main__":
    main()
