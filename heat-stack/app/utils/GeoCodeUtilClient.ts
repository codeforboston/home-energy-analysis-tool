// Client-side wrapper that uses the API route instead of direct Census API calls

// import type { CensusGeocoderResponse, AddressMatch, Geography } from '#/app/utils/GeocodeUtil'

interface GeocodeResult {
  coordinates?: {
    x: number
    y: number
  }
  state_id?: string
  county_id?: string
  addressComponents?: {
    street: string
    city: string
    state: string
    zip: string
    formattedAddress: string
  } | null
}

interface ErrorData {
  error?: string;
}

function isErrorData(data: unknown): data is ErrorData {
  return typeof data === 'object' && data !== null && 'error' in data;
}

class GeocodeUtilClient {
  /**
   * Client-side version that uses our API route to avoid CORS issues
   * @param address - The address to geocode
   * @returns Promise with coordinates, state_id, county_id, and address components
   */
  async getLL(address: string): Promise<GeocodeResult> {
    try {
      const params = new URLSearchParams({ address })
      const response = await fetch(`/api/geocode?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (isErrorData(errorData)) {
            throw new Error(errorData.error || `HTTP ${response.status}`);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
      }

      const result = await response.json() as GeocodeResult
      return result
    } catch (error) {
      console.error('Geocoding error:', error)
      // Return empty result on error to match original GeocodeUtil behavior
      return {
        coordinates: undefined,
        state_id: undefined,
        county_id: undefined,
        addressComponents: null
      }
    }
  }

  /**
   * Alternative method using POST for larger address data
   * @param address - The address to geocode
   * @returns Promise with geocoding result
   */
  async getLLPost(address: string): Promise<GeocodeResult> {
    try {
      const formData = new FormData()
      formData.append('address', address)
      
      const response = await fetch('/api/geocode', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (isErrorData(errorData)) {
            throw new Error(errorData.error || `HTTP ${response.status}`);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
      }

      const result = await response.json() as GeocodeResult
      return result
    } catch (error) {
      console.error('Geocoding error:', error)
      return {
        coordinates: undefined,
        state_id: undefined,
        county_id: undefined,
        addressComponents: null
      }
    }
  }
}

export default GeocodeUtilClient