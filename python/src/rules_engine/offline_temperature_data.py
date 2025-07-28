"""Contains function to return offline temperature data"""

import csv
import pathlib
from typing import Any

from rules_engine.pydantic_models import TemperatureInput

ROOT_DIR = pathlib.Path(__file__).parent


def load_temperature_data(weather_station: str) -> TemperatureInput:
    with open(ROOT_DIR / "temperature-data.csv", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        dates = []
        temperatures = []

        row: Any
        for row in reader:
            dates.append(row["Date"])
            temperatures.append(row[weather_station])

    return TemperatureInput(dates=dates, temperatures=temperatures)
