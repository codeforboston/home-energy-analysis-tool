import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { loader } from './geocode.ts'

// Mock the GeocodeUtil
const mockGeocodeUtil = {
	getLL: vi.fn(),
}

// Mock the GeocodeUtil class
vi.mock('#/app/utils/GeocodeUtil.ts', () => ({
	default: vi.fn().mockImplementation(() => mockGeocodeUtil),
}))

describe('geocode loader', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should return error when address parameter is missing', async () => {
		const request = new Request('http://localhost:3000/geocode')
		const response = await loader({ request, params: {}, context: {} })

		expect(response.status).toBe(400)
		const data = await response.json()
		expect(data).toEqual({
			status: 'error',
			message: 'Missing address parameter',
		})
	})

	it('should return coordinates when address is successfully geocoded', async () => {
		const mockCoordinates = { x: -71.0589, y: 42.3601 }
		mockGeocodeUtil.getLL.mockResolvedValue({
			coordinates: mockCoordinates,
			state_id: '25',
			county_id: '025',
			addressComponents: {
				street: '1 Broadway',
				city: 'Cambridge',
				state: 'MA',
				zip: '02142',
				formattedAddress: '1 BROADWAY, CAMBRIDGE, MA, 02142',
			},
		})

		const request = new Request('http://localhost:3000/geocode?address=1%20Broadway%2C%20Cambridge%2C%20MA')
		const response = await loader({ request, params: {}, context: {} })

		expect(response.status).toBe(200)
		const data = await response.json()
		expect(data).toEqual({
			coordinates: mockCoordinates,
		})
		expect(mockGeocodeUtil.getLL).toHaveBeenCalledWith('1 Broadway, Cambridge, MA')
	})

	it('should return error when geocoding returns no coordinates', async () => {
		mockGeocodeUtil.getLL.mockResolvedValue({
			coordinates: null,
			state_id: null,
			county_id: null,
			addressComponents: null,
		})

		const request = new Request('http://localhost:3000/geocode?address=invalid%20address')
		const response = await loader({ request, params: {}, context: {} })

		expect(response.status).toBe(200) // Response itself is 200, but contains error info
		const data = await response.json()
		expect(data).toEqual({
			message: 'Address, town. and state combination not found',
			status: 400,
		})
		expect(mockGeocodeUtil.getLL).toHaveBeenCalledWith('invalid address')
	})

	it('should return undefined coordinates when geocoding returns undefined', async () => {
		mockGeocodeUtil.getLL.mockResolvedValue({
			coordinates: undefined,
			state_id: null,
			county_id: null,
			addressComponents: null,
		})

		const request = new Request('http://localhost:3000/geocode?address=invalid%20address')
		const response = await loader({ request, params: {}, context: {} })

		expect(response.status).toBe(200)
		const data = await response.json()
		expect(data).toEqual({
			message: 'Address, town. and state combination not found',
			status: 400,
		})
	})

	it('should handle geocoding service errors', async () => {
		mockGeocodeUtil.getLL.mockRejectedValue(new Error('Network error'))

		const request = new Request('http://localhost:3000/geocode?address=1%20Broadway%2C%20Cambridge%2C%20MA')
		const response = await loader({ request, params: {}, context: {} })

		expect(response.status).toBe(200)
		const data = await response.json()
		expect(data).toEqual({
			message: 'Server error',
			status: 500,
		})
	})

	it('should handle empty string address parameter', async () => {
		const request = new Request('http://localhost:3000/geocode?address=')
		const response = await loader({ request, params: {}, context: {} })

		expect(response.status).toBe(400)
		const data = await response.json()
		expect(data).toEqual({
			status: 'error',
			message: 'Missing address parameter',
		})
	})

	it('should decode URL-encoded address parameters correctly', async () => {
		const mockCoordinates = { x: -71.0589, y: 42.3601 }
		mockGeocodeUtil.getLL.mockResolvedValue({
			coordinates: mockCoordinates,
		})

		const encodedAddress = '123%20Main%20St%2C%20Boston%2C%20MA%2002101'
		const decodedAddress = '123 Main St, Boston, MA 02101'
		
		const request = new Request(`http://localhost:3000/geocode?address=${encodedAddress}`)
		await loader({ request, params: {}, context: {} })

		expect(mockGeocodeUtil.getLL).toHaveBeenCalledWith(decodedAddress)
	})

	it('should handle special characters in address', async () => {
		const mockCoordinates = { x: -71.0589, y: 42.3601 }
		mockGeocodeUtil.getLL.mockResolvedValue({
			coordinates: mockCoordinates,
		})

		const specialAddress = "O'Malley's Pub, 123 Main St, Boston, MA"
		const request = new Request(`http://localhost:3000/geocode?address=${encodeURIComponent(specialAddress)}`)
		await loader({ request, params: {}, context: {} })

		expect(mockGeocodeUtil.getLL).toHaveBeenCalledWith(specialAddress)
	})

	it('should return proper content-type headers', async () => {
		const request = new Request('http://localhost:3000/geocode')
		const response = await loader({ request, params: {}, context: {} })

		expect(response.headers.get('Content-Type')).toBe('application/json')
	})
})