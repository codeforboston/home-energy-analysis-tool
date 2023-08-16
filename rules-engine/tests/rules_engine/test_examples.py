import json
from pytest import approx
import os
from unittest import TestCase

from rules_engine import engine


class TestEngine(TestCase):
    @classmethod
    def load_example(cls, folder):
        with open(folder + "/summary.json") as f:
            return json.load(f)

    @classmethod
    def setUpClass(cls):
        test_directory = os.path.dirname(os.path.abspath(__file__))
        cls.example = cls.load_example(test_directory + '/cases/examples/example-1')

    def test_average_indoor_temp(self):
        data = self.example
        avg_indoor_temp = engine.average_indoor_temp(data["thermostat_set_point"], data["setback_temp"], data["setback_hours_per_day"])
        assert data["average_indoor_temperature"] == approx(avg_indoor_temp, rel=0.1)
