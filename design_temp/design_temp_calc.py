from datetime import date
import statistics
import urllib.parse
import urllib.request
import json
import time

# Project name: design temperature calculator

# notes for project: 
# to-do: make new branch and draft pr for this code - Branch made
# to-do: is this a test or part of the web production? - Yes, switch over 
# make a unit test or several unit tests (do not need to use 12 homes, just 1 or 2) - end date period
# test those two parameters - one date or 2 locations 
# add this to main code - find way to not break original lookup code when replacing it 

# To-do: Values skipping is removing rows a good idea? - Delete that 
# To-do: Are some values expected to be none? - Yes, but not for archieve

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

# home addresses 1/2 or 1/3 between stations (each home a little closer to the first station listed)
home_addresses_between = [
    [42.524798976945576, -71.07789583077584],  # KBED and KBVY
    [42.260798, -71.116449], # KBOS and KOWD
    [42.52908661157886, -70.9504952633662], # KBVY and KBOS
    [42.572207167279664, -71.50030842792302], # KFIT and KBED
    [42.30101147544238, -71.582487985807], # KORH and KBVY
    [42.28931642548143, -71.29037355848413]  # KOWD and KFIT
]


def get_date_range(years_back, end_date=date(2025, 12, 31)):
    """Return the start date and the end_date for a given number of years back."""
    # ex: 2025 - 9 years + 1, 1, 1
    start_date = date(end_date.year - years_back + 1, 1, 1)
    
    return start_date.isoformat(), end_date.isoformat()


def calculate_design_temperatures(home_addresses, start_date, end_date):
    """Fetch hourly temperatures from Open-Meteo's archive API."""

    # start time duration 
    start_time = time.time()

    # get the latitude and longitude values into a list 
    lats = []
    lons = []

    # go through home address data and add to params api call (only one call)
    for home in home_addresses:
        lats.append(home[0])
        lons.append(home[1])

    # Build the query parameters as a dict
    # to-do: make sure to call data all in one instead of calling individually 
    params = {
        "latitude": ",".join(str(lat) for lat in lats),
        "longitude": ",".join(str(lon) for lon in lons),
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
    all_temps = []

    for location in data:

        temps = location["hourly"]["temperature_2m"]

        # Compute the 1st percentile (no pandas) for 10,20,30 year timeframes
        # there are 8776 hours in a year, so sort by extracting [-years * hours:] to get 10, 20 year values
        temp_10 = statistics.quantiles(temps[-10*8776:], n=100)[0]
        temp_20 = statistics.quantiles(temps[-20*8776:], n=100)[0]
        temp_30 = statistics.quantiles(temps, n=100)[0]

        # each tuple is a location of temps, so add one at a time to iterate through to make a table
        all_temps.append((temp_10, temp_20, temp_30))

    # calculate total time to compute function
    time_total = time.time() - start_time

    # return all values 
    return all_temps, time_total


def run_tests(home_addresses):
    """Calculate the design temperatures for 8 and 10 year ranges, and format results for a table."""
    
    # variables for holding results, accessing station_codes along with station index iteration
    results = []
    station_codes = list(weather_station_data.keys())
    
    # Get date ranges for both windows
    start_30_year, end_30_year = get_date_range(30)

    # Run 30-year window calculation
    all_temps, time_total = calculate_design_temperatures(home_addresses, start_30_year, end_30_year)

    # Run for close addresses, 10-year window
    for i, (temp_10, temp_20, temp_30) in enumerate(all_temps):
  
        # each value in results is a list of dictionaries, each dictionary being a temp value recording for each home
        results.append({
            "station": station_codes[i],
            "ASHRAE": weather_station_data[station_codes[i]],
            "temp_10": temp_10,
            "temp_20": temp_20,
            "temp_30": temp_30,
            "time": time_total,
        })

    # return values
    return results


def main():
    """Run the tests in main, then print off results into a table for each collection of close home addresses
    and homes located between weather stations."""

    print("Starting the program now...")

    # calculate temp data (10 years, 20 years, 30 years) for home addresses close to station
    close_homes_data = run_tests(home_addresses=home_addresses_close)

    # calculate temp data (10 years, 20 years, 30 years) for home addresses between two stations
    #between_homes_data = run_tests(home_addresses=home_addresses_between)

    # print data row labels
    print(f"{'Station':<8}{'ASHRAE':<12}{'10-yr':<12}{'20-yr':<12}{'30-yr':<12}{'30-yr s':<12}")
    print("-" * 60)

    # Data table for homes close to each station
    print("Homes Close to Station Data")
    for row in close_homes_data:
        print(
            f"{row['station']:<8}"
            f"{row['ASHRAE']:<12.1f}"
            f"{row['temp_10']:<12.1f}"
            f"{row['temp_20']:<12.1f}"
            f"{row['temp_30']:<12.1f}"
            f"{row['time']:<12.2f}"
        #    f"{row['time_20']:<12.2f}"
        #    f"{row['time_30']:<12.2f}"
        )
    print("\n")
    
    # Data table for homes between 2 stations - Will not use 
    # To-do: ask Steve how to format this table for homes between stations
    # Question: For homes between two stations, how will that home address be represented in the table in comparison to the station(s)?
    """print("Homes Between Stations Data")
    for row in between_homes_data:
        print(
            f"{row['station']:<8}"
            f"{row['ASHRAE']:<12.1f}"
            f"{row['temp_10']:<12.1f}"
            f"{row['temp_20']:<12.1f}"
            f"{row['temp_30']:<12.1f}"
            f"{row['time']:<12.2f}"
        )
    """
    
if __name__ == "__main__":
    main()