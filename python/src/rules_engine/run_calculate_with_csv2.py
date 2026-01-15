import argparse
import csv


def print_pretty_results(results):
    try:
        from tabulate import tabulate
    except ImportError:
        print(
            "debug",
            "\nInstall 'tabulate' for pretty output: pip install tabulate\n",
            flush=True,
        )
        for i, result in enumerate(results):
            print("debug", f"Row {i+1}: {result}", flush=True)
        return
    print("debug", "\n===== Calculation Results =====\n", flush=True)
    if results:
        headers = ["Row #"] + list(results[0].keys())
        table = []
        for i, result in enumerate(results):
            row = [i + 1] + [result[k] for k in result.keys()]
            table.append(row)
        print(
            "debug", tabulate(table, headers=headers, tablefmt="fancy_grid"), flush=True
        )
    else:
        print("debug", "No results to display.", flush=True)
    print("debug", "\n==============================\n", flush=True)


import os
import sys

from python.src.rules_engine.calculate_output import calculate_from_csv

# Path to the CSV file (relative to this script or absolute)
csv_path = os.path.join(os.path.dirname(__file__), "alternate.csv")
print("debug", f"Using CSV file at: {csv_path}")

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
    print("debug", f"CSV file not found: {csv_path}")
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
    print("debug", f"\n📄 Reading input from: {csv_file}", flush=True)
    with open(csv_file, "r") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print("debug", f"✅ Loaded {len(rows)} rows from CSV.", flush=True)
    print("debug", "🔄 Calculating results...", flush=True)
    result = None

    # Instead of processing row by row, process the entire CSV at once
    # Pass the full CSV data and form_data (can be extended to use user input)

    import pprint

    try:
        result = calculate_from_csv(csv_data=csv_data, form_data=form_data)
        print("debug", "Calculation result2:", flush=True)
        for key, value in result.items():
            print("debug", f"\n=== {key} ===\n", flush=True)
            # Special handling for processed_energy_bills: print each record on its own line, starting at position 1
            if key == "processed_energy_bills" and isinstance(value, list) and value:
                print("debug block entered", flush=True)
                for i, row in enumerate(value, start=1):
                    print("debug z BEFORE", f"{i}:", flush=True)
                    # pprint.pprint(row, sort_dicts=False)
                    print("debug z AFTER", f"{i}:", flush=True)
                print("debug block exited", flush=True)
                continue
            # Print tables for lists of dicts
            if isinstance(value, list) and value and isinstance(value[0], dict):
                try:
                    print("debug", "here", flush=True)
                    from tabulate import tabulate

                    print(
                        "debug q",
                        tabulate(value, headers="keys", tablefmt="fancy_grid"),
                        flush=True,
                    )
                except ImportError:
                    print(
                        "debug",
                        "(Install 'tabulate' for better table output)",
                        flush=True,
                    )
                    for row in value:
                        print("debug row", row, flush=True)
            # Print tables for lists of objects with __dict__
            elif isinstance(value, list) and value and hasattr(value[0], "__dict__"):
                print("debug", "list of objects", flush=True)
                try:
                    from tabulate import tabulate

                    print("debug", "there", flush=True)

                    print(
                        "debug",
                        tabulate(
                            [vars(v) for v in value],
                            headers="keys",
                            tablefmt="fancy_grid",
                        ),
                        flush=True,
                    )
                except ImportError:
                    print(
                        "debug",
                        "(Install 'tabulate' for better table output)",
                        flush=True,
                    )
                    for row in value:
                        print("debug a", vars(row), flush=True)
            # Pretty print dicts and objects
            elif isinstance(value, dict):
                print("debug", "down", flush=True)
                pprint.pprint(value, sort_dicts=False)
            elif hasattr(value, "__dict__"):
                print("debug dict", flush=True)
                pprint.pprint(vars(value), sort_dicts=False)
            else:
                print("debug", "right", flush=True)
                print("debug x", value, flush=True)
    except Exception as e:
        print("debug", f"Error during calculation: {e}", flush=True)


if __name__ == "__main__":
    main()
