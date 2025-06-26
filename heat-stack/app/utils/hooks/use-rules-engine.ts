import { useEffect, useRef, useState } from 'react'
import {
	buildCurrentMapOfUsageData,
	buildCurrentUsageData,
	objectToString,
} from '#app/utils/index.ts'
import {
	type UsageDataSchema,
	type BillingRecordsSchema,
} from '#types/types.ts'

// importRulesEngine exists so the rules-engine.ts types can be extracted without having to manually create a types.ts file.
const importRulesEngine = () => import('#app/utils/rules-engine.ts')

type RulesEngineType = Awaited<ReturnType<typeof importRulesEngine>>
type UseRulesEngineReturnType = ReturnType<typeof useRulesEngine>
export type RecalculateFunction = NonNullable<
	UseRulesEngineReturnType['recalculateFromBillingRecordsChange']
>

/**
 * Custom React hook for interacting with a Pyodide-backed rules engine.
 *
 * Exposes functions:
 * 1. `lazyLoadRulesEngine`: A fire-and-forget function that lazily loads and initializes the rules engine, but does **not** return a promise
 *    or wait for completion.
 *
 * 2. `recalculateFromBillingRecordsChange`: A function that is only available **after** the rules engine has been initialized. If not yet initialized,
 *    this will be `null`.
 *
 * Usage pattern:
 * - Call lazyLoadRulesEngine() and wait for `recalculateFromBillingRecordsChange` to transition from null to a function.
 *
 */
export const useRulesEngine = () => {
	const [isInitialized, setIsInitialized] = useState(false)
	const rulesEngineRef = useRef<RulesEngineType | null>(null)

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
		setUsageData: React.Dispatch<
			React.SetStateAction<UsageDataSchema | undefined>
		>,
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
			if (objectToString(prevUsageData) !== objectToString(newUsageData)) {
				return newUsageData
			}
			return prevUsageData
		})
	}

	useEffect(() => {
		return () => {
			// Memory cleanup of pyodide fn's when component unmounts
			if (rulesEngineRef.current?.cleanupPyodideResources) {
				rulesEngineRef.current.cleanupPyodideResources()
				rulesEngineRef.current = null
			}
		}
	}, [])

	return {
		lazyLoadRulesEngine,
		recalculateFromBillingRecordsChange: isInitialized
			? recalculateFromBillingRecordsChange
			: null,
	}
}
