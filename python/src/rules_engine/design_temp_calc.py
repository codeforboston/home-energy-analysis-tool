from datetime import date
import statistics
import urllib.parse
import urllib.request
import json
import time

# Project name: design temperature calculator

# values of wrather data from station: ASHRAE 99% temp
weather_station_data = {
    "KBED": 8.4,
    "KBOS": 13.4,
    "KBVY": 9.5,
    "KFIT": 7.7,
    "KORH": 7.1,
    "KOWD": 9.0
}

# home data (each list item representing [lat, long] data)
# to-do: post data with all 6 homes on slack
home_addresses_close = [
    [42.464969052549286, -71.28407236837398], # KBED
    [42.249806278707496, -70.9110932094538], # KBOS
    [42.584, -70.918], # KBVY
    [42.552, -71.756], # KFIT
    [42.27, -71.873], # KORH
    [42.191, -71.174] # KOWD
]


def get_date_range(years_back, end_date=date(2025, 12, 31)):
    """Return the start date and the end_date for a given number of years back."""
    # ex: 2025 - 9 years + 1, 1, 1
    start_date = date(end_date.year - years_back + 1, 1, 1)
    
    return start_date.isoformat(), end_date.isoformat()


def calculate_design_temperatures(lat, lon, start_date, end_date):
    """Fetch hourly temperatures from Open-Meteo's archive API."""

    # start time duration 
    start_time = time.time()

    # Build the query parameters as a dict
    # to-do: make sure to call data all in one instead of calling individually 
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": "temperature_2m",
        "temperature_unit": "fahrenheit",
    }
    
    # Turn the dict into a URL query string like "latitude=42.46&longitude=-71.27&..."
    query_string = urllib.parse.urlencode(params)
    url = f"https://archive-api.open-meteo.com/v1/archive?{query_string}"
    
    # Make the HTTP GET request and read the response
    with urllib.request.urlopen(url) as response:
        raw_data = response.read().decode("utf-8")

    # Parse the JSON text into a Python dict
    data = json.loads(raw_data)

    # Pull out the list of temperatures
    data = data["hourly"]["temperature_2m"]

    # Compute the 1st percentile (no pandas)
    design_temp = statistics.quantiles(data, n=100)[0]

    # calculate total time to compute function
    elapsed = time.time() - start_time

    # return all values 
    return design_temp, elapsed


def run_tests(home_addresses):
    """Calculate the design temperatures for 8 and 10 year ranges, and format results for a table."""
    # run the calculation for the close homes and the between homes

    # variables for holding results, accessing station_codes along with station index iteration
    results = []
    station_codes = list(weather_station_data.keys())
    station_index = 0
    
    # Get date ranges for both windows
    start_30_year, end_30_year = get_date_range(30)
    
    # Run for close addresses, 10-year window
    for address in home_addresses:

        # get the latitude and longitude values from each 
        lat, lon = address[0], address[1]

        # Run 30-year window calculation
        temp_30, elapsed_30 = calculate_design_temperatures(lat, lon, start_30_year, end_30_year)
        
        # each value in results is a list of dictionaries, each dictionary being a temp value recording for each home
        results.append({
            "station": station_codes[station_index],
            "ASHRAE":  weather_station_data[station_codes[station_index]],
            "temp_30": temp_30,
            "time_30": elapsed_30,
        })

        # go to the next station 
        station_index += 1

    # return values
    return results


def main():
    """Run the tests in main, then print off results into a table for each collection of close home addresses
    and homes located between weather stations."""

    print("Starting the program now...")

    # calculate temp data (10 years, 20 years, 30 years) for home addresses close to station
    close_homes_data = run_tests(home_addresses=home_addresses_close)

    # print data row labels
    print(f"{'Station':<8}{'ASHRAE':<12}{'30-yr':<12}{'30-yr seconds':<12}")
    print("-" * 60)

    # Data table for homes close to each station
    print("Homes Close to Station Data")
    for row in close_homes_data:
        print(
            f"{row['station']:<8}"
            f"{row['ASHRAE']:<12.1f}"
            f"{row['temp_30']:<12.1f}"
            f"{row['time_30']:<12.2f}"
        )
    print("\n")
    
if __name__ == "__main__":
    main()