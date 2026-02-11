// app/routes/api/geocode.ts
import Geocode from '#/app/utils/GeocodeUtil.ts' // Make sure this file is server-only
import { type Route } from './+types/geocode.ts'

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const address = url.searchParams.get('address')

	if (!address) {
		return new Response(
			JSON.stringify({ status: 'error', message: 'Missing address parameter' }),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	}

	try {
		const geocodeUtil = new Geocode()
		const { coordinates, state_id, county_id } =
			await geocodeUtil.getLL(address)

		if (!coordinates) {
			return new Response(
				JSON.stringify({
					message: 'Address, town. and state combination not found',
					status: 400,
				}),
			)
		} else if (!state_id && !county_id) {
			return new Response(
				JSON.stringify({
					message: 'State ID and county ID not found for this address',
					status: 400,
				}),
			)
		}

		return new Response(JSON.stringify({ coordinates, state_id, county_id }))
	} catch (error) {
		console.error('Geocoding error:', error)
		return new Response(
			JSON.stringify({
				message: 'Error with Census location service',
				status: 500,
			}),
		)
	}
}
