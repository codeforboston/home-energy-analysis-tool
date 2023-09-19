import json
import os
import pathlib
from typing import Any

import pytest
from pytest import approx

from rules_engine import engine

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"
INPUT_DATA = next(os.walk(ROOT_DIR))[1]


def load_example(folder: str) -> "dict[str, Any]":
    with open(ROOT_DIR / folder / "summary.json") as f:
        return json.load(f)


@pytest.mark.parametrize("file_path", INPUT_DATA)
class TestEngine:
    def test_average_indoor_temp(self, file_path):
        data = load_example(file_path)
        avg_indoor_temp = engine.average_indoor_temp(
            data["thermostat_set_point"],
            data["setback_temp"],
            data["setback_hours_per_day"],
        )
        assert data["average_indoor_temperature"] == approx(avg_indoor_temp, rel=0.1)
