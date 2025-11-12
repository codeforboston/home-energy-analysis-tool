// These functions are used to process data returned from the Action on
// /workspaces/home-energy-analysis-tool/heat-stack/app/routes/cases+/new.tsx

/** Pass this to JSON.stringify()
 *
 * Usage:
 * const originalValue = new Map([['a', 1]]);
 * const str = JSON.stringify(originalValue, replacer);
 *
 * See https://stackoverflow.com/a/56150320
 */
export function replacer(key: any, value: any) {
	if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()), // or with spread: value: [...value]
		}
	} else {
		return value
	}
}

/** Pass this to JSON.parse()
 *
 * Usage:
 * const originalValue = new Map([['a', 1]]);
 * const str = JSON.stringify(originalValue, replacer);
 * const newValue = JSON.parse(str, reviver);
 *
 * See https://stackoverflow.com/a/56150320
 */
export function reviver(key: any, value: any) {
	if (typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value)
		}
	}
	return value
}

/**
 * Translates an already replaced (see https://stackoverflow.com/a/56150320) and then parsed Map from pyodide into a plain js Object.
 * @param input {Map}
 * @returns {Object}
 */
export function replacedMapToObject(input: any): any {
	// Base case: if input is not an object or is null, return it as-is
	if (typeof input !== 'object' || input === null) {
		return input
	}

	// Handle case where input is a Map-like object (with "dataType" as "Map" and a "value" array)
	if (input.dataType === 'Map' && Array.isArray(input.value)) {
		const obj: Record<any, any> = {} // Initialize an empty object
		for (const [key, value] of input.value) {
			obj[key] = replacedMapToObject(value) // Recursively process nested Maps
		}
		return obj
	}

	// Handle case where input is an array
	if (Array.isArray(input)) {
		return input.map(replacedMapToObject) // Recursively process each array element
	}

	console.log('input', input)
	// Return the input for any other types of objects
	return input
}
