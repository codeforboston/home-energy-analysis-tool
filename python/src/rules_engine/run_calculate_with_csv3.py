import argparse
import csv
import os
import pprint
import sys

from rules_engine.calculate import calculate_from_csv

# Path to the CSV file (relative to this script or absolute)
csv_path = os.path.join(os.path.dirname(__file__), "alternate.csv")
print(f"Using CSV file at: {csv_path}", flush=True)

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
    print(f"CSV file not found: {csv_path}", flush=True)
    sys.exit(1)

with open(csv_path, "r") as f:
    csv_data = f.read()


def main():
    parser = argparse.ArgumentParser(
        description="Run rules engine calculation with CSV input."
    )
    parser.add_argument("csv_file", help="Path to the input CSV file.")
    args = parser.parse_args()

    csv_file = args.csv_file
    csv_file = csv_path
    print(f"\n📄 Reading input from: {csv_file}", flush=True)
    with open(csv_file, "r") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"✅ Loaded {len(rows)} rows from CSV.", flush=True)
    print("🔄 Calculating results...", flush=True)

    def doit(key, value):
        print(f"\n=== {key} ===\n", flush=True)
        if key == "processed_energy_bills":
            print("debug processed_energy_bills:", flush=True)
            for i, row in enumerate(value, start=1):
                print(f"{i}:", flush=True)
                pprint.pprint(row, sort_dicts=False)
        elif key == "analysisResults":
            print("debug analysisResults:", flush=True)
            # Hard-coded keys to print in fixed order
            heat_load_output = value.heat_load_output
            processed_energy_bills = value.processed_energy_bills
            balance_point_graph_records = value.balance_point_graph.records
            print("\n--- heat_load_output ---\n", flush=True)
            pprint.pprint(heat_load_output, sort_dicts=False)
            print("\n--- processed_energy_bills ---\n", flush=True)
            pprint.pprint(processed_energy_bills, sort_dicts=False)
            print("\n--- balance_point_graph ---\n", flush=True)
            pprint.pprint(balance_point_graph_records, sort_dicts=False)
        else:
            if key == "convertedDatesTIWD" and isinstance(value, dict):
                dates = value.get("dates", [])
                temperatures = value.get("temperatures", [])
                print("convertedDatesTIWD (date, temperature):", flush=True)
                for date, temp in zip(dates, temperatures):
                    print(f"{date}: {temp}", flush=True)
            else:
                print("debug generic value:", flush=True)
                pprint.pprint(value, sort_dicts=False)

    try:
        result = calculate_from_csv(csv_data=csv_data, form_data=form_data)
        print("Calculation result:", flush=True)
        doit("convertedDatesTIWD", result.get("convertedDatesTIWD"))
        doit("state_id", result.get("state_id"))
        doit("county_id", result.get("county_id"))
        doit("analysisResults", result.get("analysisResults"))
        doit("processed_energy_bills", result.get("processed_energy_bills"))
    except Exception as e:
        print(f"Error during calculation: {e}", flush=True)


if __name__ == "__main__":
    main()
