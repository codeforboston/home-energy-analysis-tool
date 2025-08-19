import { useEffect, useRef, useState } from 'react'
import {
	buildCurrentMapOfUsageData,
	buildCurrentUsageData,
	hasDataProperty,
	objectToString,
} from '#app/utils/index.ts'
import { type EnergyUsageSubmitActionData } from '#types/single-form.ts'
import {
	type UsageDataSchema,
	type BillingRecordsSchema,
} from '#types/types.ts'
import { reviver } from '../data-parser'

// importRulesEngine exists so the rules-engine.ts types can be extracted without having to manually create a types.ts file.
const importRulesEngine = () => import('#app/utils/rules-engine.ts')

type RulesEngineType = Awaited<ReturnType<typeof importRulesEngine>>
type UseRulesEngineReturnType = ReturnType<typeof useRulesEngine>
export type RecalculateFunction = NonNullable<
	UseRulesEngineReturnType['recalculateFromBillingRecordsChange']
>

/**
 * Custom React hook for interacting with a Pyodide-backed rules engine and keeps track of usage data.
 *
 * Usage pattern:
 * - Call lazyLoadRulesEngine() and wait for `recalculateFromBillingRecordsChange` to transition from null to a function.
 *
 */
export const useRulesEngine = (
	actionData: EnergyUsageSubmitActionData | undefined,
) => {
	const [isInitialized, setIsInitialized] = useState(false)
	const rulesEngineRef = useRef<RulesEngineType | null>(null)
	const [usageData, setUsageData] = useState<UsageDataSchema | undefined>()

	const lazyLoadRulesEngine = () => {
		if (isInitialized) {
			return
		}
		importRulesEngine()
			.then((rulesEngine) => {
				setIsInitialized(true)
				rulesEngineRef.current = rulesEngine
			})
			.catch(() => {
				throw new Error('Failed to load rules engine.')
			})
	}

	/** RECALCULATE WHEN BILLING RECORDS UPDATE -- maybe this can be more generic in the future */
	const recalculateFromBillingRecordsChange = (
		parsedLastResult: Map<any, any> | undefined,
		billingRecords: BillingRecordsSchema,
		parsedAndValidatedFormSchema: any,
		convertedDatesTIWD: any,
		state_id: any,
		county_id: any,
	) => {
		const rulesEngine = rulesEngineRef.current

		if (!parsedLastResult || !isInitialized || !rulesEngine) return
		// replace original Rules Engine's billing records with new UI's billingRecords
		const parsedNextResult = buildCurrentMapOfUsageData(
			parsedLastResult,
			billingRecords,
		)

		// why are set back temp and set back hour not optional for this one?? do we need to put nulls in or something?
		const calcResultPyProxy = rulesEngine.executeRoundtripAnalyticsFromFormJs(
			parsedAndValidatedFormSchema,
			convertedDatesTIWD,
			parsedNextResult,
			state_id,
			county_id,
		)
		const calcResult = calcResultPyProxy.toJs()
		calcResultPyProxy.destroy()

		const newUsageData = calcResult && buildCurrentUsageData(calcResult)

		setUsageData((prevUsageData) => {
			let v = prevUsageData?.processed_energy_bills || []
			console.log(
				'rules engine prev',
				v[0]?.inclusion_override,
				v[1]?.inclusion_override,
				v[2]?.inclusion_override,
			)
			const v2 = prevUsageData?.processed_energy_bills || []
			console.log(
				'rules engine 2',
				v2[0]?.inclusion_override,
				v[1]?.inclusion_override,
				v[2]?.inclusion_override,
			)
			if (objectToString(prevUsageData) !== objectToString(newUsageData)) {
				console.log('new')
				return newUsageData
			}
			console.log('prev')
			return prevUsageData
		})
	}

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

		if (!recalculateFromBillingRecordsChange) {
			// if this function was called and there is no recalculateFromBillingRecordsChange then pyodide was not initialized and something went wrong
			throw new Error('recalculateFromBillingRecordsChange was not found')
		}

		const newRecords = structuredClone(usageData.processed_energy_bills)
		const period = newRecords[index]

		if (!period) {
			throw new Error(`No period with row index ${index} was found`)
		}

		const currentOverride = period.inclusion_override

		// Toggle 'inclusion_override'
		period.inclusion_override = !currentOverride

		newRecords[index] = { ...period }

		recalculateFromBillingRecordsChange(
			// TODO: I think we should be passing usageDataAsMap BUT there will be an error thrown because
			// usageDataAsMap.get('balance_point_graph') changes from a map to a map of proxies resulting
			// in an error thrown by structuredClone inside of buildCurrentMapOfUsageData.
			// Previous implementation passed actionData.data to buildCurrentMapOfUsageData which feels wrong but works.
			JSON.parse(actionData.data, reviver) as Map<any, any> | undefined,
			newRecords,
			actionData.parsedAndValidatedFormSchema,
			actionData.convertedDatesTIWD,
			actionData.state_id,
			actionData.county_id,
		)
	}

	// shutdown pyodide when component unmounts
	useEffect(() => {
		return () => {
			// Memory cleanup of pyodide fn's when component unmounts
			if (rulesEngineRef.current?.cleanupPyodideResources) {
				rulesEngineRef.current.cleanupPyodideResources()
				rulesEngineRef.current = null
			}
		}
	}, [])

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
		lazyLoadRulesEngine,
		toggleBillingPeriod,
		usageData,
		recalculateFromBillingRecordsChange: isInitialized
			? recalculateFromBillingRecordsChange
			: null,
	}
}
