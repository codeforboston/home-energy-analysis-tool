const BASE_URL = 'https://archive-api.open-meteo.com'
const WHATEVER_PATH = '/v1/archive'

interface ArchiveApiResponse {
	latitude: number
	longitude: number
	generationtime_ms: number
	utc_offset_seconds: number
	timezone: string
	timezone_abbreviation: string
	elevation: number
	daily_units: {
		time: string
		temperature_2m_mean: string
	}
	daily: {
		time: string[]
		temperature_2m_mean: (number | null)[]
	}
}

/** produced by this class */
export type TemperatureInputDataInitial = {
	dates: Date[]
	temperatures: (number | null)[]
}

/**
 *  I believe this is the format we use in Python Rules Engine
 * TODO: consolidate?
 */
export type TemperatureInputDataConverted = {
	dates: (string | undefined)[]
	temperatures: (number | null)[]
}
class WeatherUtil {
	/**
	 *
	 * @param longitude
	 * @param latitude
	 * @param startDate
	 * @param endDate
	 * @returns {Promise<TemperatureInputDataInitial>}
	 *      * example for 2 years before 4th of June 2024: {
	 *   dates: [ 2022-06-04T00:00:00.000Z, 2022-06-05T00:00:00.000Z, ... ],
	 *   temperatures: [ 71.6, 76.3, ... ]
	 * }
	 */
	async getThatWeathaData(
		longitude: number,
		latitude: number,
		startDate: string,
		endDate: string,
	): Promise<TemperatureInputDataInitial | undefined> {
		const params = new URLSearchParams()

		params.append('latitude', `${latitude}`)
		params.append('longitude', `${longitude}`)
		params.append('daily', 'temperature_2m_mean')
		params.append('timezone', 'America/New_York')
		params.append('start_date', startDate)
		params.append('end_date', endDate)
		params.append('temperature_unit', 'fahrenheit')

		let url = new URL(BASE_URL + WHATEVER_PATH + '?' + params.toString())
		const maxRetries = 3
		let retryCount = 0

		while (retryCount <= maxRetries) {
			try {
				// Using undici's fetch
				const rezzy = await fetch(url.toString())

				if (!rezzy.ok) {
					throw new Error(`HTTP error! Status: ${rezzy.status}`)
				}

				const jrez = (await rezzy.json()) as ArchiveApiResponse

				let dates: Date[] = []
				jrez.daily.time.forEach((timeStr: string) => {
					dates.push(new Date(timeStr))
				})

				let temperatures: (number | null)[] = jrez.daily.temperature_2m_mean
				// console.log({dates,temperatures});

				return { dates, temperatures }
			} catch (error) {
				retryCount++

				if (retryCount <= maxRetries) {
					// Exponential backoff
					const delay = Math.pow(2, retryCount) * 1000 // 2s, 4s, 8s
					console.log(`Attempt ${retryCount} failed. Retrying in ${delay}ms...`)
					await new Promise((resolve) => setTimeout(resolve, delay))
				} else {
          const exceptionMessage = 'Failed to fetch weather data after multiple attempts.\nClick OK and click calculate again.'
          //@ts-ignore
          error.exceptionMessage = exceptionMessage
					console.error(exceptionMessage)
					throw error
				}
			}
		}
	}
}

export default WeatherUtil
