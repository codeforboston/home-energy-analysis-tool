const BASE_URL = 'https://thadk-cors.herokuapp.com/https://geocoding.geo.census.gov'
const ADDRESS_ENDPOINT = '/geocoder/geographies/onelineaddress'

// example: https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=1%20broadway%2C%20cambridge%2C%20ma%2002142&benchmark=4&vintage=4&format=json
interface CensusGeocoderResponse {
	result: {
		input: {
			address: {
				address: string
			}
			vintage: {
				isDefault: boolean
				id: string
				vintageName: string
				vintageDescription: string
			}
			benchmark: {
				isDefault: boolean
				benchmarkDescription: string
				id: string
				benchmarkName: string
			}
		}
		addressMatches: AddressMatch[]
	}
}

interface AddressMatch {
	tigerLine: {
		side: string
		tigerLineId: string
	}
	geographies: {
		'State Legislative Districts - Upper': Geography[]
		States: Geography[]
		'Combined Statistical Areas': Geography[]
		'2020 Urban Areas - Corrected': Geography[]
		'County Subdivisions': Geography[]
		'State Legislative Districts - Lower': Geography[]
		'Incorporated Places': Geography[]
		Counties: Geography[]
		'116th Congressional Districts': Geography[]
		'Census Tracts': Geography[]
		'Census Blocks': Geography[]
	}
	coordinates: {
		x: number
		y: number
	}
	addressComponents: {
		zip: string
		streetName: string
		preType: string
		city: string
		preDirection: string
		suffixDirection: string
		fromAddress: string
		state: string
		suffixType: string
		toAddress: string
		suffixQualifier: string
		preQualifier: string
	}
	matchedAddress: string
}

interface Geography {
	GEOID: string
	CENTLAT: string
	AREAWATER: number
	STATE: string
	BASENAME: string
	OID: string
	LSADC: string
	[key: string]: string | number /* a bit dubious catchall by the
                                     LLM for all the semi-optional keys */
}

class GeocodeUtil {
	/**
	 *
	 * @param {*} address
	 * @returns x,y {x,y} lon/lat. If the given address was valid. I've implemented 0 handling here.
	 *  This is the happiest of paths, with hardcoded values also...
	 */
	async getLL(address: string) {
		const params = new URLSearchParams()

		params.append('address', address)
		params.append('format', 'json')
		params.append('benchmark', '2020')
		params.append('vintage', 'Census2020_Census2020')

		/**  TODO: note that for this Census API you can specify particular parts of this that
     we want (x, y, state_id, and county_id for now), read the docs */
		let url = new URL(BASE_URL + ADDRESS_ENDPOINT + '?' + params.toString())
		let rezzy = await fetch(url, {
			headers: {
				'Origin': 'https://thadk.static.observableusercontent.com',
				'X-Requested-With': 'XMLHttpRequest'
			}
			})
		let jrez = (await rezzy.json()) as CensusGeocoderResponse
		// TODO: Return all addresses and let the user choose the right one
		// const fs = await import('node:fs')
		// fs.writeFileSync('geocoder.json', JSON.stringify(jrez, null, 2), {encoding: "utf-8"})
		const addressMatch = jrez?.result?.addressMatches?.[0]
		let coordz = addressMatch?.coordinates
		const addressComponents = addressMatch?.addressComponents

		// console.log(JSON.stringify(jrez, null, 2));
		return {
			coordinates: coordz,
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
	}
}

export default GeocodeUtil
