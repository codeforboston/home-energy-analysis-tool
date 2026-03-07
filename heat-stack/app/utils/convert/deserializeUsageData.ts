// Utility to deeply convert usageData to an object and coerce string fields to numbers/dates for usageData

import invariant from '#node_modules/openimg/dist/types/utils.js'

// **** New version of pyodide 0.29 may not require this if we can ensure it outputs plain objects with correct types, but this is a safeguard for now. ****
export function deserializeUsageData(input: any): any {
	// Recursively convert Maps to plain objects, arrays, and coerce fields
	function deepDeserialize(serializedValue: any): any {
		if (serializedValue instanceof Map) {
			// Convert Map to plain object, recursively
			const obj: any = {}
			for (const [key, value] of serializedValue.entries()) {
				obj[key] = deepDeserialize(value)
			}
			return obj
		} else if (Array.isArray(serializedValue)) {
			return serializedValue.map((item) => deepDeserialize(item))
		} else if (serializedValue && typeof serializedValue === 'object') {
			// Coerce known fields in bill objects
			const out: any = {}
			for (const key of Object.keys(serializedValue)) {
				let value = serializedValue[key]
				// Coerce bill fields if present
				if (key === 'usage' && typeof value === 'string') {
					value = Number(value)
				} else if (
					(key === 'period_start_date' || key === 'period_end_date') &&
					typeof value === 'string'
				) {
					const dateValue = new Date(value)
					invariant(
						!isNaN(dateValue.getTime()),
						`Invalid date string for ${key}: ${value}`,
					)
					value = dateValue.getTime()
				}
				out[key] = deepDeserialize(value)
			}
			return out
		}
		return serializedValue
	}
	return deepDeserialize(input)
}
