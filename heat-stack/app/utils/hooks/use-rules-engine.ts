import { useEffect, useRef, useState } from 'react'
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

// importRulesEngine exists so the rules-engine.ts types can be extracted without having to manually create a types.ts file.
const importRulesEngine = () => import('#app/utils/rules-engine.ts')

type RulesEngineType = Awaited<ReturnType<typeof importRulesEngine>>

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
		usageData,
	}
}
