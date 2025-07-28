"""Test fetching of offline temperature data"""

from datetime import datetime

from rules_engine import offline_temperature_data

_STATION_NAME = "KBVY"
_STATION_TEMPERATURES = (43.4, 43.4, 29.6)
_STATION_DATE_TIME_ARGUMENTS = (
    (2011, 1, 1, 0, 0),
    (2011, 1, 2, 0, 0),
    (2011, 1, 3, 0, 0),
)
_STATION_DATE_TIMES = [datetime(*argument) for argument in _STATION_DATE_TIME_ARGUMENTS]
_STATION_TEMPERATURES = (41.7, 31.9, 30.5)


def test_load_temperature_data():
    """
    Test whether offline temperature data loading occurs if the Beta2
    feature flag is raised
    """
    temperature_input = offline_temperature_data.load_temperature_data(_STATION_NAME)
    for i in range(3):
        assert temperature_input.dates[i] == _STATION_DATE_TIMES[i]
        assert temperature_input.temperatures[i] == _STATION_TEMPERATURES[i]
