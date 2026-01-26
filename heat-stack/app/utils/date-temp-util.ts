/** This function takes a CSV string and an address
 * and returns date and weather data,
 * and geolocation information
 */

import { type NaturalGasUsageDataSchema } from '#types/index.ts'
import { formatDateString, parseOrDefaultDates } from './dateHelpers.ts'
import GeocodeUtil from './GeocodeUtil.ts'
import WeatherUtil, {
	type TemperatureInputDataConverted,
} from './WeatherUtil.ts'

// Define interface for address components
export interface AddressComponents {
	street: string
	city: string
	state: string
	zip: string
	formattedAddress: string
}

export default async function getConvertedDatesTIWD(
	start_date: Date,
	end_date: Date,
	street_address: string,
	town: string,
	state: string,
): Promise<{
	convertedDatesTIWD: TemperatureInputDataConverted
	state_id: string | undefined
	county_id: string | number | undefined
	coordinates: { x: number; y: number } | null | undefined
	addressComponents: AddressComponents | null
}> {
	console.log('loading geocodeUtil/weatherUtil')

	const geocodeUtil = new GeocodeUtil()
	const weatherUtil = new WeatherUtil()

	const combined_address = `${street_address}, ${town}, ${state}`
	const { coordinates, state_id, county_id, addressComponents } =
		await geocodeUtil.getLL(combined_address)
	let { x, y } = coordinates ?? { x: 0, y: 0 }


	// Utility function to parse start and end dates, with defaults if invalid

	// Function to ensure we always return a valid date string

	const weatherData = await weatherUtil.getThatWeathaData(
		x,
		y,
		formatDateString(start_date),
		formatDateString(end_date),
	)

	if (weatherData === undefined) {
		throw new Error('weather data failed to fetch')
	}

	const datesFromTIWD = weatherData.dates.map(
		(datestring) => new Date(datestring).toISOString().split('T')[0],
	)
	const convertedDatesTIWD: TemperatureInputDataConverted = {
		dates: datesFromTIWD,
		temperatures: weatherData.temperatures,
	}

	return {
		convertedDatesTIWD,
		state_id,
		county_id,
		coordinates,
		addressComponents,
	}
}

export type GetConvertedDatesTIWDResponse = Awaited<
	ReturnType<typeof getConvertedDatesTIWD>
>
