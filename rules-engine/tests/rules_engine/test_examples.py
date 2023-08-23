import json
import os
import pathlib
import pytest
# import glob
from pytest import approx

from rules_engine import engine

# Test inputs are provided as separate directory within the "cases/examples" directory
# Each subdirectory contains a JSON file (named summary.json) which specifies the inputs for the test runner
#INPUT_DATA = [os.path.dirname(os.path.abspath(__file__)) + "/cases/examples/" + ex for ex in ["example-1"]]
ROOT_DIR = pathlib.Path(os.path.dirname(os.path.abspath(__file__)), "cases", "examples")
INPUT_DATA = [o for o in ROOT_DIR.iterdir() if o.is_dir()]


def test_input_data():
    print(os.listdir(os.path.dirname(os.path.abspath(__file__)) + "/cases/examples"))
    assert INPUT_DATA

@pytest.mark.parametrize("file_path", INPUT_DATA)
class TestEngine:
    @classmethod
    def load_example(cls, folder):
        with open(folder + "/summary.json") as f:
            return json.load(f)

    def test_average_indoor_temp(self, file_path):
        data = self.load_example(file_path)
        avg_indoor_temp = engine.average_indoor_temp(
            data["thermostat_set_point"],
            data["setback_temp"],
            data["setback_hours_per_day"],
        )
        assert data["average_indoor_temperature"] == approx(avg_indoor_temp, rel=0.1)