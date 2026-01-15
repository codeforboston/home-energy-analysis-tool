import json
import time
from datetime import datetime
from typing import Any, Dict, List, Optional
from urllib import error, parse, request

from .pydantic_models import TemperatureInput

BASE_URL = "https://archive-api.open-meteo.com"
WHATEVER_PATH = "/v1/archive"


class WebWeatherUtil:
    @staticmethod
    def get_that_weatha_data(
        longitude: float, latitude: float, start_date: str, end_date: str
    ) -> Optional[Dict[str, List[Any]]]:
        """
        :param longitude: Longitude of the location
        :param latitude: Latitude of the location
        :param start_date: Start date in YYYY-MM-DD format
        :param end_date: End date in YYYY-MM-DD format
        :return: Dictionary with 'dates' (list of datetime objects) and 'temperatures' (list of floats or None)
        """
        params = {
            "latitude": str(latitude),
            "longitude": str(longitude),
            "daily": "temperature_2m_mean",
            "timezone": "America/New_York",
            "start_date": start_date,
            "end_date": end_date,
            "temperature_unit": "fahrenheit",
        }

        query_string = parse.urlencode(params)
        url = f"{BASE_URL}{WHATEVER_PATH}?{query_string}"
        max_retries = 3
        retry_count = 0

        while retry_count <= max_retries:
            try:
                with request.urlopen(url) as response:
                    if response.status != 200:
                        raise Exception(f"HTTP error {response.status}")
                    body = response.read().decode()
                    data = json.loads(body)

                    dates = data["daily"]["time"]
                    # print removed
                    # for t in data["daily"]["temperature_2m_mean"]:
                    #         # print removed
                    #     if isinstance(t, (str, int, float)):
                    #             # print removed
                    #     else:
                    # print removed
                    temperatures = [
                        float(t)
                        for t in data["daily"]["temperature_2m_mean"]
                        if type(t) in (str, int, float)
                    ]
                    # print removed

                    result = TemperatureInput(dates=dates, temperatures=temperatures)
                    # print removed
                    return result

            except Exception as e:
                retry_count += 1
                if retry_count <= max_retries:
                    delay = 2**retry_count
                    # print removed
                    time.sleep(delay)
                else:
                    # print removed
                    raise


# Example usage
if __name__ == "__main__":
    result = WebWeatherUtil.get_that_weatha_data(
        longitude=-73.935242,
        latitude=40.730610,
        start_date="2022-06-04",
        end_date="2022-06-10",
    )
    print(result)
