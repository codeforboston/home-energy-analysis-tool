import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import getConvertedDatesTIWD, {
	type AddressComponents,
} from './date-temp-util.ts'

// Mock the GeocodeUtil
const mockGeocodeUtil = {
	getLL: vi.fn(),
}

// Mock the WeatherUtil
const mockWeatherUtil = {
	getThatWeathaData: vi.fn(),
}

// Mock the utility classes
vi.mock('./GeocodeUtil.ts', () => ({
	default: vi.fn().mockImplementation(() => mockGeocodeUtil),
}))

vi.mock('./WeatherUtil.ts', () => ({
	default: vi.fn().mockImplementation(() => mockWeatherUtil),
}))

describe('getConvertedDatesTIWD', () => {
	const mockStartDate = new Date('2023-01-01')
	const mockEndDate = new Date('2023-12-31')

	const mockGeocodeResponse = {
		coordinates: { x: -71.0589, y: 42.3601 },
		state_id: '25',
		county_id: '025',
		addressComponents: {
			street: '123 Main St',
			city: 'Boston',
			state: 'MA',
			zip: '02101',
			formattedAddress: '123 MAIN ST, BOSTON, MA, 02101',
		} as AddressComponents,
	}

	const mockWeatherData = {
		dates: ['2023-01-01', '2023-01-02', '2023-01-03'],
		temperatures: [30, 32, 28],
	}

	beforeEach(() => {
		vi.clearAllMocks()

		// Setup default mock implementations
		mockGeocodeUtil.getLL.mockResolvedValue(mockGeocodeResponse)
		mockWeatherUtil.getThatWeathaData.mockResolvedValue(mockWeatherData)

		// Mock console methods to avoid noise in tests
		vi.spyOn(console, 'log').mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('successful execution', () => {
		it('should successfully convert dates and fetch weather data', async () => {
			const result = await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(result).toEqual({
				convertedDatesTIWD: {
					dates: ['2023-01-01', '2023-01-02', '2023-01-03'],
					temperatures: [30, 32, 28],
				},
				state_id: '25',
				county_id: '025',
				coordinates: { x: -71.0589, y: 42.3601 },
				addressComponents: {
					street: '123 Main St',
					city: 'Boston',
					state: 'MA',
					zip: '02101',
					formattedAddress: '123 MAIN ST, BOSTON, MA, 02101',
				},
			})
		})

		it('should call geocodeUtil with properly formatted address', async () => {
			await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(mockGeocodeUtil.getLL).toHaveBeenCalledWith(
				'123 Main St, Boston, MA',
			)
		})

		it('should call weatherUtil with correct coordinates and dates', async () => {
			await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(mockWeatherUtil.getThatWeathaData).toHaveBeenCalledWith(
				-71.0589,
				42.3601,
				'2023-01-01',
				'2023-12-31',
			)
		})

		it('should handle null coordinates gracefully', async () => {
			mockGeocodeUtil.getLL.mockResolvedValue({
				...mockGeocodeResponse,
				coordinates: null,
			})

			await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(mockWeatherUtil.getThatWeathaData).toHaveBeenCalledWith(
				0,
				0,
				'2023-01-01',
				'2023-12-31',
			)
		})

		it('should handle undefined coordinates gracefully', async () => {
			mockGeocodeUtil.getLL.mockResolvedValue({
				...mockGeocodeResponse,
				coordinates: undefined,
			})

			await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(mockWeatherUtil.getThatWeathaData).toHaveBeenCalledWith(
				0,
				0,
				'2023-01-01',
				'2023-12-31',
			)
		})
	})

	describe('date string formatting', () => {
		it('should format dates correctly', async () => {
			const result = await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			// Check that all dates are in YYYY-MM-DD format
			result.convertedDatesTIWD.dates.forEach((date) => {
				expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
			})
		})
	})

	describe('error handling', () => {
		it('should throw error when weather data fetch fails', async () => {
			mockWeatherUtil.getThatWeathaData.mockResolvedValue(undefined)

			await expect(
				getConvertedDatesTIWD(
					mockStartDate,
					mockEndDate,
					'123 Main St',
					'Boston',
					'MA',
				),
			).rejects.toThrow('weather data failed to fetch')
		})

		it('should handle geocoding service errors', async () => {
			mockGeocodeUtil.getLL.mockRejectedValue(new Error('Geocoding failed'))

			await expect(
				getConvertedDatesTIWD(
					mockStartDate,
					mockEndDate,
					'123 Main St',
					'Boston',
					'MA',
				),
			).rejects.toThrow('Geocoding failed')
		})

		it('should handle weather service errors', async () => {
			mockWeatherUtil.getThatWeathaData.mockRejectedValue(
				new Error('Weather service failed'),
			)

			await expect(
				getConvertedDatesTIWD(
					mockStartDate,
					mockEndDate,
					'123 Main St',
					'Boston',
					'MA',
				),
			).rejects.toThrow('Weather service failed')
		})
	})

	describe('edge cases', () => {
		it('should handle empty address components', async () => {
			const street = ''
			const town = ''
			const state = ''

			await getConvertedDatesTIWD(mockStartDate, mockEndDate, street, town, state)

			expect(mockGeocodeUtil.getLL).toHaveBeenCalledWith(', , ')
		})

		it('should handle special characters in addresses', async () => {
			const street = "O'Malley's Pub"
			const town = "St. John's"
			const state = 'NY'

			await getConvertedDatesTIWD(mockStartDate, mockEndDate, street, town, state)

			expect(mockGeocodeUtil.getLL).toHaveBeenCalledWith(
				"O'Malley's Pub, St. John's, NY",
			)
		})

		it('should handle weather data with empty arrays', async () => {
			mockWeatherUtil.getThatWeathaData.mockResolvedValue({
				dates: [],
				temperatures: [],
			})

			const result = await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(result.convertedDatesTIWD).toEqual({
				dates: [],
				temperatures: [],
			})
		})

		it('should handle coordinate values of zero', async () => {
			mockGeocodeUtil.getLL.mockResolvedValue({
				...mockGeocodeResponse,
				coordinates: { x: 0, y: 0 },
			})

			await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(mockWeatherUtil.getThatWeathaData).toHaveBeenCalledWith(
				0,
				0,
				'2023-01-01',
				'2023-12-31',
			)
		})
	})

	describe('date string formatting (ISO)', () => {
		it('should handle ISO date strings correctly', async () => {
			const isoStartDate = new Date('2023-01-01T00:00:00.000Z')
			const isoEndDate = new Date('2023-12-31T23:59:59.999Z')

			await getConvertedDatesTIWD(
				isoStartDate,
				isoEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(mockWeatherUtil.getThatWeathaData).toHaveBeenCalledWith(
				expect.any(Number),
				expect.any(Number),
				'2023-01-01',
				'2023-12-31',
			)
		})

		it('should return consistently formatted date strings', async () => {
			const weatherDataWithISO = {
				dates: ['2023-01-01T00:00:00.000Z', '2023-01-02T12:30:45.123Z'],
				temperatures: [30, 32],
			}

			mockWeatherUtil.getThatWeathaData.mockResolvedValue(weatherDataWithISO)

			const result = await getConvertedDatesTIWD(
				mockStartDate,
				mockEndDate,
				'123 Main St',
				'Boston',
				'MA',
			)

			expect(result.convertedDatesTIWD.dates).toEqual([
				'2023-01-01',
				'2023-01-02',
			])
		})
	})
})
