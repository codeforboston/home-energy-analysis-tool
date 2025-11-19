import * as pyodideModule from 'pyodide'
import { type PyodideInterface } from 'pyodide'
import { type z } from '#node_modules/zod'
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import { type Schema } from '#types/single-form.ts'
import getAnalyticsPyCode from '../pycode/get_analytics.py?raw'
import parseGasBillPyCode from '../pycode/parse_gas_bill.py?raw'
import roundtripAnalyticsPyCode from '../pycode/roundtrip_analytics.py?raw'
import { safeDestroy } from './pyodide'
import { type TemperatureInputDataConverted } from './WeatherUtil'

// Import Python code as raw string assets

const isServer = typeof window === 'undefined'
const basePath = isServer ? 'public/pyodide-env/' : '/pyodide-env/'

/* 
    LOAD PYODIDE 
*/
const getPyodide = async (): Promise<PyodideInterface> => {
	return await pyodideModule.loadPyodide({
		// This path is actually `public/pyodide-env`, but the browser knows where `public` is. Note that remix server needs `public/`
		// TODO: figure out how to determine if we're in browser or remix server and use ternary.
		indexURL: basePath,
	})
}

const runPythonScript = async (): Promise<PyodideInterface> => {
	const pyodide: PyodideInterface = await getPyodide()
	return pyodide
}

// consider running https://github.com/codeforboston/home-energy-analysis-tool/blob/main/python/tests/test_rules_engine/test_engine.py
const pyodide: PyodideInterface = await runPythonScript()

/* 
    LOAD PACKAGES 
    NOTES for pydantic, typing-extensions, annotated_types: 
        pyodide should match pyodide-core somewhat. 
        typing-extensions needs specific version per https://github.com/pyodide/pyodide/issues/4234#issuecomment-1771735148
        try getting it from 
        - https://pypi.org/project/pydantic/#files
        - https://pypi.org/project/typing-extensions/
        - https://pypi.org/project/annotated-types/#files
*/
await pyodide.loadPackage(
	`${basePath}pydantic_core-2.27.2-cp313-cp313-pyodide_2025_0_wasm32.whl`,
)
await pyodide.loadPackage(`${basePath}pydantic-2.10.6-py3-none-any.whl`)
await pyodide.loadPackage(
	`${basePath}typing_extensions-4.14.0-py3-none-any.whl`,
)
await pyodide.loadPackage(`${basePath}annotated_types-0.7.0-py3-none-any.whl`)
await pyodide.loadPackage(`${basePath}rules_engine-0.0.1-py3-none-any.whl`)

/* 
    RULES-ENGINE CALLS
*/
/**
 * CSV Parser
 * Need to parse the gas bill first to determine the start and end dates of the bill
 * so that we can request the weather for those dates.
 * Example result:
 * records: [
 *   Map(4) {
 *     'period_start_date' => '2022-10-04',
 *     'period_end_date' => '2022-11-03',
 *     'usage_therms' => 19,
 *     'inclusion_override' => undefined
 *   }
 * ],
 * 'overall_start_date' => '2020-10-02',
 * 'overall_end_date' => '2022-11-03'
 */
export const executeParseGasBillPy: ExecuteParseFunction =
	await pyodide.runPythonAsync(parseGasBillPyCode + '\nexecuteParse')

/**
 * Full call with csv data
 * call to get_outputs_natural_gas
 */
export const executeGetAnalyticsFromFormJs: ExecuteGetAnalyticsFunction =
	await pyodide.runPythonAsync(
		getAnalyticsPyCode + '\nexecuteGetAnalyticsFromForm',
	)

/**
 * Full call with userAdjustedData
 * second time and after, when table is modified, this becomes entrypoint
 */
export const executeRoundtripAnalyticsFromFormJs: ExecuteRoundtripAnalyticsFunction =
	await pyodide.runPythonAsync(
		roundtripAnalyticsPyCode + '\nexecuteRoundtripAnalyticsFromForm',
	)

// Type for the execute parse function
export type ExecuteParseFunction = ((csvDataJs: string) => PyProxy) & {
	destroy(): void
	toJs?(): any
}

// Type for the execute analytics function - notice we're using Maps now
type ExecuteGetAnalyticsFunction = ((
	summaryInputJs: z.infer<typeof Schema>,
	temperatureInputJs: TemperatureInputDataConverted,
	csvDataJs: string,
	state_id: string | undefined,
	county_id: string | number | undefined /* check number */,
) => PyProxy) & {
	destroy(): void
	toJs?(): any
}

// Type for a processed energy bill item using Maps
type ProcessedEnergyBill = Map<string, any> // OR you can be more specific:
/*
type ProcessedEnergyBill = Map
  | 'period_start_date' 
  | 'period_end_date' 
  | 'usage' 
  | 'analysis_type_override'
  | 'inclusion_override'
  | 'analysis_type'
  | 'default_inclusion'
  | 'eliminated_as_outlier'
  | 'whole_home_heat_loss_rate',
  any
>;
*/

// Type for the user adjusted data structure using Maps
interface UserAdjustedData {
	processed_energy_bills: ProcessedEnergyBill[]
}

// Type for the execute roundtrip function using Maps
type ExecuteRoundtripAnalyticsFunction = ((
	summaryInputJs: z.infer<typeof Schema>,
	temperatureInputJs: TemperatureInputDataConverted,
	userAdjustedData: UserAdjustedData | Map<string, any>,
	state_id: string | undefined,
	county_id: string | number | undefined /* check number */,
) => PyProxy) & {
	destroy(): void
	toJs?(): any
}
// When you're done with your application or this module, call this to destroy all the Python function proxies
export function cleanupPyodideProxies() {
	safeDestroy(executeParseGasBillPy)
	safeDestroy(executeGetAnalyticsFromFormJs)
	safeDestroy(executeRoundtripAnalyticsFromFormJs)
	// If you have access to the pyodide instance itself, you might want to clean it up too
	// pyodide.destroy(); // If supported by your pyodide version
}
