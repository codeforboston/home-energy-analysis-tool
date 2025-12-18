// Extracted from case.logic.server.ts
import { executeParseGasBillPy, executeGetAnalyticsFromFormJs } from '#app/utils/rules-engine.ts'
import { fileUploadHandler } from '#app/utils/file-upload-handler.ts'
import { type PyProxy } from '#public/pyodide-env/ffi.js'

export async function calculateResults(submission: any, formData: FormData, uploadedTextFile: string) {
	const parsedForm = submission.value
	const pyodideProxy: PyProxy = executeParseGasBillPy(uploadedTextFile)
	const pyodideResults = pyodideProxy.toJs()
	// TODO: make function that destroys if it exists
	// pyodideProxy.destroy()

	const { convertedDatesTIWD, state_id, county_id } =
		await getConvertedDatesTIWD(
			pyodideResults,
			parsedForm.street_address,
			parsedForm.town,
			parsedForm.state,
		)

	// Use invariant from '@epic-web/invariant' if needed in util
	if (!state_id) throw new Error('Missing state_id')
	if (!county_id) throw new Error('Missing county_id')

	const gasBillDataProxy: PyProxy = executeGetAnalyticsFromFormJs(
		parsedForm,
		convertedDatesTIWD,
		uploadedTextFile,
		state_id,
		county_id,
	)
	const gasBillData = gasBillDataProxy.toJs()
	// gasBillDataProxy.destroy()

	return { convertedDatesTIWD, state_id, county_id, gasBillData, parsedForm }
}
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

	const startDateString = pyodideResultsFromTextFile.get('overall_start_date')
	const endDateString = pyodideResultsFromTextFile.get('overall_end_date')

	if (
		typeof startDateString !== 'string' ||
		typeof endDateString !== 'string'
	) {
		throw new Error('Start date or end date is missing or invalid')
	}

	// Get today's date
	const today = new Date()
	// Calculate the date 2 years ago from today
	const twoYearsAgo = new Date(today)
	twoYearsAgo.setFullYear(today.getFullYear() - 2)

	let start_date = new Date(startDateString)
	let end_date = new Date(endDateString)

	// Use default dates if parsing fails
	if (isNaN(start_date.getTime())) {
		console.warn('Invalid start date, using date from 2 years ago')
		start_date = twoYearsAgo
	}
	if (isNaN(end_date.getTime())) {
		console.warn("Invalid end date, using today's date")
		end_date = today
	}

	// Function to ensure we always return a valid date string
	const formatDateString = (date: Date): string => {
		return date.toISOString().split('T')[0] || date.toISOString().slice(0, 10)
	}

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
