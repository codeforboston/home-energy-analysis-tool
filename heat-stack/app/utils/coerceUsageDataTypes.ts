// Utility to deeply convert Maps to objects and coerce string fields to numbers/dates for usageData
// **** New version of pyodide 0.29 may not require this if we can ensure it outputs plain objects with correct types, but this is a safeguard for now. ****
export function coerceUsageDataTypes(input: any): any {
	// Recursively convert Maps to plain objects, arrays, and coerce fields
	function deepCoerce(val: any): any {
		if (val instanceof Map) {
			// Convert Map to plain object, recursively
			const obj: any = {}
			for (const [k, v] of val.entries()) {
				obj[k] = deepCoerce(v)
			}
			return obj
		} else if (Array.isArray(val)) {
			return val.map(deepCoerce)
		} else if (val && typeof val === 'object') {
			// Coerce known fields in bill objects
			const out: any = {}
			for (const k of Object.keys(val)) {
				let v = val[k]
				// Coerce bill fields if present
				if (k === 'usage' && typeof v === 'string') {
					v = Number(v)
				} else if (
					(k === 'period_start_date' || k === 'period_end_date') &&
					typeof v === 'string'
				) {
					const d = new Date(v)
					v = isNaN(d.getTime()) ? v : d
				}
				out[k] = deepCoerce(v)
			}
			return out
		}
		return val
	}
	return deepCoerce(input)
}
