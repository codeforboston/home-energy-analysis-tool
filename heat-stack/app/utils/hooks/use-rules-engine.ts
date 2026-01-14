import { useEffect, useRef, useState } from 'react'
import {
	buildCurrentMapOfUsageData,
	buildCurrentUsageData,
	hasDataProperty,
	objectToString,
} from '#app/utils/index.ts'
import { type SchemaZodFromFormType } from '#types/single-form.ts'
import {
	type UsageDataSchema,
	type BillingRecordsSchema,
} from '#types/types.ts'
import { reviver } from '../data-parser'
import { type TemperatureInputDataConverted } from '../WeatherUtil'

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
	const [isInitialized, setIsInitialized] = useState(false)
	const rulesEngineRef = useRef<RulesEngineType | null>(null)
	const [usageData, setUsageData] = useState<UsageDataSchema | undefined>()

	const lazyLoadRulesEngine = () => {
		if (isInitialized) {
			console.log('⚠️ Rules engine already initialized')
			return
		}
		console.log('🔄 Starting to load rules engine...')
		importRulesEngine()
			.then((rulesEngine) => {
				console.log('✅ Rules engine loaded successfully')
				rulesEngineRef.current = rulesEngine
				setIsInitialized(true)
			})
			.catch((error) => {
				console.error('❌ Failed to load rules engine:', error)
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

		console.log('🔧 recalculateFromBillingRecordsChange called', {
			hasParsedLastResult: !!parsedLastResult,
			isInitialized,
			hasRulesEngine: !!rulesEngine,
			billingRecordsCount: billingRecords.length,
		})

		if (!parsedLastResult) {
			console.warn('⚠️ No parsedLastResult provided')
			return
		}

		if (!rulesEngine) {
			console.warn(
				'⚠️ Rules engine not loaded yet - please wait for initialization',
			)
			return
		}

		console.log('🔄 Building current map of usage data...')
		// replace original Rules Engine's billing records with new UI's billingRecords
		const parsedNextResult = buildCurrentMapOfUsageData(
			parsedLastResult,
			billingRecords,
		)

		console.log('🧮 Calling executeRoundtripAnalyticsFromFormJs...')
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
		console.log('✅ Rules engine calculation completed')

		const newUsageData = calcResult && buildCurrentUsageData(calcResult)
		console.log('📊 New usage data built:', newUsageData)

		setUsageData((prevUsageData) => {
			console.log('🔄 Comparing usage data...')

			if (objectToString(prevUsageData) !== objectToString(newUsageData)) {
				console.log('✅ Usage data changed, updating state')
				return newUsageData
			}
			console.log('⚠️ Usage data unchanged, keeping previous')
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

		if (!isInitialized) {
			// if this function was called and pyodide was not initialized, something went wrong
			throw new Error('rulesEngine was not found')
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
			if (rulesEngineRef.current?.cleanupPyodideProxies) {
				rulesEngineRef.current.cleanupPyodideProxies()
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
		recalculateFromBillingRecordsChange:
			isInitialized && rulesEngineRef.current
				? recalculateFromBillingRecordsChange
				: null,
	}
}
