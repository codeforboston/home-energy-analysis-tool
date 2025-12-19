/** This function takes a CSV string and an address
 * and returns date and weather data,
 * and geolocation information
 */

import { type NaturalGasUsageDataSchema } from '#types/index.ts'
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

const formatDateString = (date: Date): string => {
	return date.toISOString().split('T')[0] || date.toISOString().slice(0, 10)
}
function parseOrDefaultDates(
	startDateString: string,
	endDateString: string,
): { start_date: Date; end_date: Date } {
	if (
		typeof startDateString !== 'string' ||
		typeof endDateString !== 'string'
	) {
		throw new Error('Start date or end date is missing or invalid')
	}

	const today = new Date()
	const twoYearsAgo = new Date(today)
	twoYearsAgo.setFullYear(today.getFullYear() - 2)

	let start_date = new Date(startDateString)
	let end_date = new Date(endDateString)

	if (isNaN(start_date.getTime())) {
		console.warn('Invalid start date, using date from 2 years ago')
		start_date = twoYearsAgo
	}
	if (isNaN(end_date.getTime())) {
		console.warn("Invalid end date, using today's date")
		end_date = today
	}

	return { start_date, end_date }
}
export default async function getConvertedDatesTIWD(
	pyodideResultsFromTextFile: NaturalGasUsageDataSchema,
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

	console.log('geocoded', x, y)

	const startDateString = pyodideResultsFromTextFile.get('overall_start_date') as string
	const endDateString = pyodideResultsFromTextFile.get('overall_end_date') as string

	const { start_date, end_date } = parseOrDefaultDates(startDateString, endDateString)

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
