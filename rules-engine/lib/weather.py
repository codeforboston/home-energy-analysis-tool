# This is using a free resource I found that is from the NWS

import requests
import constants as cs

def getDegreeDay(location, date):
    PARAMS = {

        'sid':location,
        'elems':'cdd,hdd',
        'date':date

    }
    return requests.get(url = cs.WEATHER_URL + '/StnData', params = PARAMS)

def getDegreeDaysRange(location, start_date, end_date):
    PARAMS = {

        'sid':location,
        'elems':'cdd,hdd',
        'sdate':start_date,
        'edate':end_date
    }
    return requests.get(url = cs.WEATHER_URL + '/StnData', params = PARAMS)


# Here is the test run
print(getDegreeDay('BOS',20230610))