import argparse
import csv


def print_pretty_results(results):
    try:
        from tabulate import tabulate
    except ImportError:
        print("\nInstall 'tabulate' for pretty output: pip install tabulate\n")
        for i, result in enumerate(results):
            print(f"Row {i+1}: {result}")
        return
    print("\n===== Calculation Results =====\n")
    if results:
        headers = ["Row #"] + list(results[0].keys())
        table = []
        for i, result in enumerate(results):
            row = [i + 1] + [result[k] for k in result.keys()]
            table.append(row)
        print(tabulate(table, headers=headers, tablefmt="fancy_grid"))
    else:
        print("No results to display.")
    print("\n==============================\n")


import os
import sys

from rules_engine.calculate import calculate_from_csv

# Path to the CSV file (relative to this script or absolute)
csv_path = os.path.join(os.path.dirname(__file__), "alternate.csv")
print(f"Using CSV file at: {csv_path}")

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


def main():
    parser = argparse.ArgumentParser(
        description="Run rules engine calculation with CSV input."
    )
    parser.add_argument("csv_file", help="Path to the input CSV file.")
    args = parser.parse_args()

    csv_file = args.csv_file
    csv_file = csv_path
    print(f"\n📄 Reading input from: {csv_file}")
    with open(csv_file, "r") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"✅ Loaded {len(rows)} rows from CSV.")
    print("🔄 Calculating results...")
    result = None

    # Instead of processing row by row, process the entire CSV at once
    # Pass the full CSV data and form_data (can be extended to use user input)

    import pprint

    try:
        result = calculate_from_csv(csv_data=csv_data, form_data=form_data)
        print("Calculation result:")
        for key, value in result.items():
            print(f"\n=== {key} ===\n")
            # Special handling for processed_energy_bills: print first record separately, start at position 1
            if key == "processed_energy_bills" and isinstance(value, list) and value:
                print("1:")
                pprint.pprint(value[0], sort_dicts=False)
                if len(value) > 1:
                    print()
                    try:
                        from tabulate import tabulate

                        print(
                            tabulate(
                                value[1:],
                                headers="keys",
                                tablefmt="fancy_grid",
                                showindex=range(2, len(value) + 1),
                            )
                        )
                    except ImportError:
                        print("(Install 'tabulate' for better table output)")
                        for i, row in enumerate(value[1:], start=2):
                            print(f"{i}:")
                            pprint.pprint(row, sort_dicts=False)
                continue
            # Print tables for lists of dicts
            if isinstance(value, list) and value and isinstance(value[0], dict):
                try:
                    from tabulate import tabulate

                    print(tabulate(value, headers="keys", tablefmt="fancy_grid"))
                except ImportError:
                    print("(Install 'tabulate' for better table output)")
                    for row in value:
                        print(row)
            # Print tables for lists of objects with __dict__
            elif isinstance(value, list) and value and hasattr(value[0], "__dict__"):
                try:
                    from tabulate import tabulate

                    print(
                        tabulate(
                            [vars(v) for v in value],
                            headers="keys",
                            tablefmt="fancy_grid",
                        )
                    )
                except ImportError:
                    print("(Install 'tabulate' for better table output)")
                    for row in value:
                        print(vars(row))
            # Pretty print dicts and objects
            elif isinstance(value, dict):
                pprint.pprint(value, sort_dicts=False)
            elif hasattr(value, "__dict__"):
                pprint.pprint(vars(value), sort_dicts=False)
            else:
                print(value)
    except Exception as e:
        print(f"Error during calculation: {e}")


if __name__ == "__main__":
    main()
