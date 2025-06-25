// app/routes/api/geocode.ts
// import { type LoaderFunctionArgs } from '@remix-run/node'
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
            }
          )
        }
        
          

	try {
		const geocodeUtil = new Geocode()
		const { coordinates } = await geocodeUtil.getLL(address)

		if (!coordinates) {
			return new Response(JSON.stringify({ message: 'Address not found', status: 400}))
		}
	
		return new Response(JSON.stringify({coordinates}))

	} catch (error) {
		console.error('Geocoding error:', error)
		return new Response(JSON.stringify({ message: 'Server error' , status: 500 }))
	}
}
