"""Test fetching of offline temperature data"""

import pathlib
from datetime import datetime

from rules_engine import offline_temperature_data
from rules_engine.pydantic_models import TemperatureInput

_STATION_NAME = "KBED"
_STATION_TEMPERATURES = (43.4, 43.4, 29.6)
_STATION_DATE_TIME_ARGUMENTS = (
    (2011, 1, 1, 0, 0),
    (2011, 1, 2, 0, 0),
    (2011, 1, 3, 0, 0),
)
_STATION_DATE_TIMES = [datetime(*argument) for argument in _STATION_DATE_TIME_ARGUMENTS]


def test_load_temperature_data():
    """
    Test whether offline temperature data loading occurs if the Beta2
    feature flag is raised
    """
    temperature_input = offline_temperature_data.load_temperature_data(_STATION_NAME)
    for i in range(3):
        assert temperature_input.dates[i] == _STATION_DATE_TIMES[i]
