import CensusGeocoderResponse from "#/app/utils/GeocodeUtil"
import { type Route } from './+types/geocode'

const BASE_URL = 'https://geocoding.geo.census.gov'
const ADDRESS_ENDPOINT = '/geocoder/geographies/onelineaddress'

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const address = url.searchParams.get('address')

	if (!address) {
		return Response.json(
			{ error: 'Address parameter is required' },
			{ status: 400 },
		)
	}

	try {
		const params = new URLSearchParams()
		params.append('address', address)
		params.append('format', 'json')
		params.append('benchmark', '2020')
		params.append('vintage', 'Census2020_Census2020')

		const apiUrl = new URL(
			BASE_URL + ADDRESS_ENDPOINT + '?' + params.toString(),
		)

		const response = await fetch(apiUrl)

		if (!response.ok) {
			throw new Error(`Geocoding API error: ${response.status}`)
		}

		const data = (await response.json()) as CensusGeocoderResponse

		// Transform the response to match GeocodeUtil.getLL() return format
		const addressMatch = data?.result?.addressMatches?.[0]
		const coordinates = addressMatch?.coordinates
		const addressComponents = addressMatch?.addressComponents

		const result = {
			coordinates,
			state_id: addressMatch?.geographies.Counties?.[0]?.['STATE'],
			county_id: addressMatch?.geographies?.Counties?.[0]?.['COUNTY'],
			addressComponents: addressComponents
				? {
						street:
							`${addressComponents.preDirection || ''} ${addressComponents.streetName || ''} ${addressComponents.suffixType || ''}`.trim(),
						city: addressComponents.city || '',
						state: addressComponents.state || '',
						zip: addressComponents.zip || '',
						formattedAddress: addressMatch?.matchedAddress || address,
					}
				: null,
		}

		return Response.json(result, {
			headers: {
				'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
			},
		})
	} catch (error) {
		console.error('Geocoding error:', error)
		return Response.json(
			{ error: 'Failed to geocode address' },
			{ status: 500 },
		)
	}
}

// Optionally support POST requests for larger address data
export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const address = formData.get('address')

	if (!address || typeof address !== 'string') {
		return Response.json(
			{ error: 'Address parameter is required' },
			{ status: 400 },
		)
	}

	// Reuse the same logic as the loader
	const url = new URL(request.url)
	url.searchParams.set('address', address)

	const getRequest = new Request(url.toString(), { method: 'GET' })
	return loader({ request: getRequest } as Route.LoaderArgs)
}
