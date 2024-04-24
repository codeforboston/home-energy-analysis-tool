import * as pyodideModule from 'pyodide'
import { expect, test } from 'vitest'
import GeocodeUtil from "#app/utils/GeocodeUtil.js";
import WeatherUtil from "#app/utils/WeatherUtil.js";
// import PyodideUtil  from "#app/utils/pyodide.util.js";


/* For this to pass, you must run 
    `pushd ../rules-engine && python3 -m venv venv && source venv/bin/activate && pip install -q build && python3 -m build && popd` */

/* Referenced https://github.com/epicweb-dev/full-stack-testing/blob/main/exercises/04.unit-test/02.solution.spies/app/utils/misc.error-message.test.ts of https://www.epicweb.dev/workshops/web-application-testing*/
test('pyodide loads', async () => {
	const getPyodide = async () => {
		// public folder:
		return await pyodideModule.loadPyodide({
			indexURL: 'public/pyodide-env/',
		})
	}
	const runPythonScript = async () => {
		const pyodide: any = await getPyodide()
		// console.log(engine);
		// await pyodide.loadPackage('numpy')

		/* NOTES for pyodide-core:
		      need to be a special version from the release page, no pure whl: https://github.com/pydantic/pydantic-core/pull/128
		      get it from https://github.com/pydantic/pydantic-core/releases e.g. https://github.com/pydantic/pydantic-core/releases/download/v2.14.5/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl
		*/
		await pyodide.loadPackage(
			'public/pyodide-env/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl',
		)

		/* NOTES for pydantic, typing-extensions, annotated_types: 
		    pyodide should match pyodide-core somewhat. 
	        typing-extensions needs specific version per https://github.com/pyodide/pyodide/issues/4234#issuecomment-1771735148
			try getting it from 
			   - https://pypi.org/project/pydantic/#files
			   - https://pypi.org/project/typing-extensions/
			   - https://pypi.org/project/annotated-types/#files
		*/
		await pyodide.loadPackage(
			'public/pyodide-env/pydantic-2.5.2-py3-none-any.whl',
		)
		await pyodide.loadPackage(
			'public/pyodide-env/typing_extensions-4.8.0-py3-none-any.whl',
		)
		await pyodide.loadPackage(
			'public/pyodide-env/annotated_types-0.5.0-py3-none-any.whl',
		)

		/* NOTES FOR DEBUGGING new requirements.txt
		      and getting specific versions of pure whl */
		// the below works but uses the internet/pypi content delivery network rather than localhost.
		// await pyodide.loadPackage('micropip')
		// const micropip = await pyodide.pyimport('micropip')
		// await micropip.install([
		// 	'typing-extensions==4.8.0',
		// 	'pydantic_core==2.14.5',
		// 	'pydantic==2.5.2',
		// ])
		// await micropip.install(['annotated-types'])

		await pyodide.loadPackage(
			'../rules-engine/dist/rules_engine-0.0.1-py3-none-any.whl',
		)

		return pyodide
	}
	// consider running https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/tests/test_rules_engine/test_engine.py
	const pyodide: any = await runPythonScript()
	const result = await pyodide.runPythonAsync(`
	from rules_engine import engine

	out = engine.hdd(57, 60)
	out`)
	expect(result).toBe(3)
}, 6000)


test('pyodide gets the weather', async () => {
	const getPyodide = async () => {
		// public folder:
		return await pyodideModule.loadPyodide({
			indexURL: 'public/pyodide-env/',
		})
	}
	const runPythonScript = async () => {
		const pyodide: any = await getPyodide()
		// console.log(engine);
		// await pyodide.loadPackage('numpy')

		/* NOTES for pyodide-core:
		      need to be a special version from the release page, no pure whl: https://github.com/pydantic/pydantic-core/pull/128
		      get it from https://github.com/pydantic/pydantic-core/releases e.g. https://github.com/pydantic/pydantic-core/releases/download/v2.14.5/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl
		*/
		await pyodide.loadPackage(
			'public/pyodide-env/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl',
		)

		/* NOTES for pydantic, typing-extensions, annotated_types: 
		    pyodide should match pyodide-core somewhat. 
	        typing-extensions needs specific version per https://github.com/pyodide/pyodide/issues/4234#issuecomment-1771735148
			try getting it from 
			   - https://pypi.org/project/pydantic/#files
			   - https://pypi.org/project/typing-extensions/
			   - https://pypi.org/project/annotated-types/#files
		*/
		await pyodide.loadPackage(
			'public/pyodide-env/pydantic-2.5.2-py3-none-any.whl',
		)
		await pyodide.loadPackage(
			'public/pyodide-env/typing_extensions-4.8.0-py3-none-any.whl',
		)
		await pyodide.loadPackage(
			'public/pyodide-env/annotated_types-0.5.0-py3-none-any.whl',
		)

		/* NOTES FOR DEBUGGING new requirements.txt
		      and getting specific versions of pure whl */
		// the below works but uses the internet/pypi content delivery network rather than localhost.
		// await pyodide.loadPackage('micropip')
		// const micropip = await pyodide.pyimport('micropip')
		// await micropip.install([
		// 	'typing-extensions==4.8.0',
		// 	'pydantic_core==2.14.5',
		// 	'pydantic==2.5.2',
		// ])
		// await micropip.install(['annotated-types'])

		await pyodide.loadPackage(
			'../rules-engine/dist/rules_engine-0.0.1-py3-none-any.whl',
		)

		return pyodide
	}
	// consider running https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/tests/test_rules_engine/test_engine.py
	const pyodide: any = await runPythonScript()

	const GU = new GeocodeUtil();
	const WU = new WeatherUtil();

	// 1)  parser.parse_gas_bill(data: str, company: NaturalGasCompany)
	// https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/src/rules_engine/parser.py#L60

	/* 2) get_outputs_natural_gas(
    summary_input: SummaryInput,
    temperature_input: TemperatureInput,
    natural_gas_billing_input: NaturalGasBillingInput,
		) -> RulesEngineResult 

	https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/src/rules_engine/engine.py#L59
	*/

	/**
	 * TODO:
	 * - Match up our types with rules engine types at https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/src/rules_engine/pydantic_models.py#L57
	 * - Use those to create summary_input (in the same file)
	 * - Use those to create temperature_input (in the same file)
	 * - Use those to create natural_gas_billing_input (in the same file)
	 */

	const address = "1 Broadway, Cambridge, MA 02142"
	let { x, y } = await GU.getLL(address);
	console.log ("address", address, x, y)
	const TIWD = await WU.getThatWeathaData(x, y, "2024-03-20", "2024-04-20");
	console.log("weather data",TIWD)

	// https://github.com/codeforboston/home-energy-analysis-tool/tree/main/rules-engine/tests/test_rules_engine/cases/examples/quateman
	const exampleNationalGridCSV = `Name,FIRST LAST,,,,,
	Address,"100 STREET AVE, BOSTON MA 02130",,,,,
	Account Number,1111111111,,,,,
	Service,Service 1,,,,,
	,,,,,,
	TYPE,START DATE,END DATE,USAGE,UNITS,COST,NOTES
	Natural gas billing,10/2/2020,11/4/2020,29,therms,$42.08 ,
	Natural gas billing,11/5/2020,12/3/2020,36,therms,$65.60 ,
	Natural gas billing,12/4/2020,1/7/2021,97,therms,$159.49 ,
	Natural gas billing,1/8/2021,2/5/2021,105,therms,$169.09 ,
	Natural gas billing,2/6/2021,3/5/2021,98,therms,$158.19 ,
	Natural gas billing,3/6/2021,4/6/2021,66,therms,$111.79 ,
	Natural gas billing,4/7/2021,5/5/2021,22,therms,$43.16 ,
	Natural gas billing,5/6/2021,6/7/2021,19,therms,$32.42 ,
	Natural gas billing,6/8/2021,7/6/2021,7,therms,$18.68 ,
	Natural gas billing,7/7/2021,8/4/2021,10,therms,$21.73 ,
	Natural gas billing,8/5/2021,9/8/2021,11,therms,$25.35 ,
	Natural gas billing,9/9/2021,10/5/2021,8,therms,$19.58 ,
	Natural gas billing,10/6/2021,11/3/2021,13,therms,$27.10 ,
	Natural gas billing,11/4/2021,12/6/2021,41,therms,$87.45 ,
	Natural gas billing,12/7/2021,1/5/2022,86,therms,$171.92 ,
	Natural gas billing,1/6/2022,2/3/2022,132,therms,$248.63 ,
	Natural gas billing,2/4/2022,3/7/2022,116,therms,$226.66 ,
	Natural gas billing,3/8/2022,4/4/2022,49,therms,$109.44 ,
	Natural gas billing,4/5/2022,5/5/2022,39,therms,$87.54 ,
	Natural gas billing,5/6/2022,6/6/2022,20,therms,$44.30 ,
	Natural gas billing,6/7/2022,7/5/2022,9,therms,$27.71 ,
	Natural gas billing,7/6/2022,8/3/2022,7,therms,$23.86 ,
	Natural gas billing,8/4/2022,9/3/2022,8,therms,$24.04 ,
	Natural gas billing,9/4/2022,10/3/2022,8,therms,$26.41 ,
	Natural gas billing,10/4/2022,11/3/2022,19,therms,$48.92 ,`

	// NaturalGasCompany = National Grid is 2 for now
	const exampleNationalGridNaturalGasCompany = "2"

	// csv is 1st arg. 2nd arg should have a selection of whether Eversource (1) or National Grid (2).
	// rules engine-returned objects can be modified and passed back to rules engine

	const summaryInput = ``  // Type? Dict?
	const temperatureInput = ``  // Type? Dict?
	const naturalGasBillingInput = ``  // Type? Dict?


	const result = await pyodide.runPythonAsync(`
	from rules_engine import parser

	exampleNationalGridCSV = """${exampleNationalGridCSV}"""
	naturalGasInputRecords = parser.parse_gas_bill(exampleNationalGridCSV, parser.NaturalGasCompany.NATIONAL_GRID)
	
	naturalGasInputRecords
	`)

	/* double quotes inside the template are not an accident 
	   and are important for the fixture to match
	*/
	const expectedFixtureResultForQuateman = `"NaturalGasBillingInput(records=[NaturalGasBillingRecordInput(period_start_date=datetime.date(2020, 10, 2), period_end_date=datetime.date(2020, 11, 4), usage_therms=29.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2020, 11, 5), period_end_date=datetime.date(2020, 12, 3), usage_therms=36.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2020, 12, 4), period_end_date=datetime.date(2021, 1, 7), usage_therms=97.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 1, 8), period_end_date=datetime.date(2021, 2, 5), usage_therms=105.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 2, 6), period_end_date=datetime.date(2021, 3, 5), usage_therms=98.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 3, 6), period_end_date=datetime.date(2021, 4, 6), usage_therms=66.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 4, 7), period_end_date=datetime.date(2021, 5, 5), usage_therms=22.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 5, 6), period_end_date=datetime.date(2021, 6, 7), usage_therms=19.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 6, 8), period_end_date=datetime.date(2021, 7, 6), usage_therms=7.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 7, 7), period_end_date=datetime.date(2021, 8, 4), usage_therms=10.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 8, 5), period_end_date=datetime.date(2021, 9, 8), usage_therms=11.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 9, 9), period_end_date=datetime.date(2021, 10, 5), usage_therms=8.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 10, 6), period_end_date=datetime.date(2021, 11, 3), usage_therms=13.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 11, 4), period_end_date=datetime.date(2021, 12, 6), usage_therms=41.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2021, 12, 7), period_end_date=datetime.date(2022, 1, 5), usage_therms=86.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 1, 6), period_end_date=datetime.date(2022, 2, 3), usage_therms=132.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 2, 4), period_end_date=datetime.date(2022, 3, 7), usage_therms=116.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 3, 8), period_end_date=datetime.date(2022, 4, 4), usage_therms=49.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 4, 5), period_end_date=datetime.date(2022, 5, 5), usage_therms=39.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 5, 6), period_end_date=datetime.date(2022, 6, 6), usage_therms=20.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 6, 7), period_end_date=datetime.date(2022, 7, 5), usage_therms=9.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 7, 6), period_end_date=datetime.date(2022, 8, 3), usage_therms=7.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 8, 4), period_end_date=datetime.date(2022, 9, 3), usage_therms=8.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 9, 4), period_end_date=datetime.date(2022, 10, 3), usage_therms=8.0, inclusion_override=None), NaturalGasBillingRecordInput(period_start_date=datetime.date(2022, 10, 4), period_end_date=datetime.date(2022, 11, 3), usage_therms=19.0, inclusion_override=None)])"`
	
	/* toString() is calling on the pyodide PyProxy to extract it.
	 Do we want to use .toJS()? Can we do a real fixture using that output in vitest? */
	const resultInJsonString = JSON.stringify(result.toString())

	expect(resultInJsonString).toBe(expectedFixtureResultForQuateman)
}, 20000)
