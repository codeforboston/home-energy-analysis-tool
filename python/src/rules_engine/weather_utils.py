import time
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from urllib import request, parse, error
from .pydantic_models import TemperatureInput

BASE_URL = "https://archive-api.open-meteo.com"
WHATEVER_PATH = "/v1/archive"


class WeatherUtil:
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
                    print("debug a")

                    dates = data["daily"]["time"]
                    print("debug b", dates[0], type(dates[0]))
                    for t in data["daily"]["temperature_2m_mean"]:
                        if isinstance(t, (str, int, float)):
                            print("ok", type(t))
                        else:
                            print(f"unexpected value: {t}, type: {type(t)}")
                    temperatures = [
                        float(t)
                        for t in data["daily"]["temperature_2m_mean"]
                        if type(t) in (str, int, float)
                    ]

                    result = TemperatureInput(dates=dates, temperatures=temperatures)
                    print(
                        "result",
                    )
                    return result

            except Exception as e:
                retry_count += 1
                if retry_count <= max_retries:
                    delay = 2**retry_count
                    print(
                        f"Attempt {retry_count} failed. Retrying in {delay} seconds..."
                    )
                    time.sleep(delay)
                else:
                    print("Failed to fetch weather data after multiple attempts:", e)
                    raise


# Example usage
if __name__ == "__main__":
    result = WeatherUtil.get_that_weatha_data(
        longitude=-73.935242,
        latitude=40.730610,
        start_date="2022-06-04",
        end_date="2022-06-10",
    )
    print(result)
