/** This function takes a CSV string and an address
 * and returns date and weather data,
 * and geolocation information 
*/ 

import { type NaturalGasUsageDataSchema } from "#types/index.ts";
import GeocodeUtil from "./GeocodeUtil.ts";
import { executeParseGasBillPy } from "./rules-engine.ts";
import WeatherUtil from "./WeatherUtil.ts";

export default async function getConvertedDatesTIWD(uploadedTextFile: string, address: string,) {
    
    console.log('loading geocodeUtil/weatherUtil')

    const geocodeUtil = new GeocodeUtil()
    const weatherUtil = new WeatherUtil()

    let {coordinates, state_id, county_id}  = await geocodeUtil.getLL(address)
    let {x, y} = coordinates ?? {x: 0, y: 0};

    console.log('geocoded', x, y)

    /** Example:
     * records: [
     *   Map(4) {
     *     'period_start_date' => '2022-10-04',
     *     'period_end_date' => '2022-11-03',
     *     'usage_therms' => 19,
     *     'inclusion_override' => undefined
     *   }
     * ],
     * 'overall_start_date' => '2020-10-02',
     * 'overall_end_date' => '2022-11-03'
     */
    // This assignment of the same name is a special thing. We don't remember the name right now.
    // It's not necessary, but it is possible.
    const pyodideResultsFromTextFile: NaturalGasUsageDataSchema = executeParseGasBillPy(uploadedTextFile).toJs()

    // console.log('result', pyodideResultsFromTextFile )//, validateNaturalGasUsageData(pyodideResultsFromTextFile))
    const startDateString = pyodideResultsFromTextFile.get('overall_start_date');
    const endDateString = pyodideResultsFromTextFile.get('overall_end_date');

    if (typeof startDateString !== 'string' || typeof endDateString !== 'string') {
        throw new Error('Start date or end date is missing or invalid');
    }

    // Get today's date
    const today = new Date();
    // Calculate the date 2 years ago from today
    const twoYearsAgo = new Date(today);
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    let start_date = new Date(startDateString);
    let end_date = new Date(endDateString);

    // Use default dates if parsing fails
    if (isNaN(start_date.getTime())) {
        console.warn('Invalid start date, using date from 2 years ago');
        start_date = twoYearsAgo;
    }
    if (isNaN(end_date.getTime())) {
        console.warn('Invalid end date, using today\'s date');
        end_date = today;
    }

    // Function to ensure we always return a valid date string
    const formatDateString = (date: Date): string => {
        return date.toISOString().split('T')[0] || date.toISOString().slice(0, 10);
    };

    const weatherData = await weatherUtil.getThatWeathaData(
        x,
        y,
        formatDateString(start_date),
        formatDateString(end_date)
    );

    const datesFromTIWD = weatherData.dates.map(datestring => new Date(datestring).toISOString().split('T')[0])
    const convertedDatesTIWD = {dates: datesFromTIWD, temperatures: weatherData.temperatures}

    return {convertedDatesTIWD, state_id, county_id}
}