import { useEffect, useState } from 'react'
import {
	buildCurrentUsageData,
	hasDataProperty,
} from '#app/utils/index.ts'
import { type SchemaZodFromFormType } from '#types/single-form.ts'
import {
	type UsageDataSchema,
} from '#types/types.ts'
import { reviver } from '../data-parser'
import { type TemperatureInputDataConverted } from '../WeatherUtil'



/**
 * Custom React hook for interacting with a Pyodide-backed rules engine and keeps track of usage data.
 *
 * Usage pattern:
 * - Call lazyLoadRulesEngine() and wait for `recalculateFromBillingRecordsChange` to transition from null to a function.
 */
export type RulesEngineActionData =
	| {
			data: string
			parsedAndValidatedFormSchema: SchemaZodFromFormType
			convertedDatesTIWD: TemperatureInputDataConverted
			state_id: string | undefined
			county_id: string | number | undefined
	  }
	| undefined

export const useRulesEngine = (
	actionData: RulesEngineActionData | undefined,
) => {
	// Removed isInitialized and rulesEngineRef as they are unused and RulesEngineType is undefined
	const [usageData, setUsageData] = useState<UsageDataSchema | undefined>()

	/**
	 * Toggles the selection state of a table row corresponding to a specific billing period,
	 * and updates the overall energy usage calculation.
	 *
	 * @param index - The index of the billing period row whose checkbox was clicked.
	 */
	const toggleBillingPeriod = (index: number) => {
		if (!usageData) {
			// if this function was called and there is no usage data, something went wrong
			throw new Error('usageData was not found')
		}

		if (!actionData) {
			// if this function was called and there is no actionData, something went wrong
			throw new Error('actionData was not found')
		}

		// ...existing code...

		const newRecords = structuredClone(usageData.processed_energy_bills)
		const period = newRecords[index]

		if (!period) {
			throw new Error(`No period with row index ${index} was found`)
		}

		const currentOverride = period.inclusion_override

		// Toggle 'inclusion_override'
		period.inclusion_override = !currentOverride

		newRecords[index] = { ...period }

	}

	// shutdown pyodide when component unmounts

	// reset usage data as a result of user submitting a new bill
	useEffect(() => {
		if (actionData !== undefined && hasDataProperty(actionData)) {
			const usageDataAsMap = JSON.parse(actionData.data, reviver) as Map<
				any,
				any
			>
			const newUsageData = buildCurrentUsageData(usageDataAsMap)
			setUsageData(newUsageData)
		}
	}, [actionData])

	return {
		toggleBillingPeriod,
		usageData,
	}
}
