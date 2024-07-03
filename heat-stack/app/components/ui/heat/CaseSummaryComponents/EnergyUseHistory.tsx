import { Suspense, lazy } from 'react'
import { FieldMetadata, useForm } from '@conform-to/react'
import { Form, useLocation } from '@remix-run/react'
import { ErrorList } from "./ErrorList.tsx"
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { Button } from '#/app/components/ui/button.tsx'

import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'
import { Upload } from 'lucide-react'


import * as pyodideModule from 'pyodide'
import GeocodeUtil from "#app/utils/GeocodeUtil";
import WeatherUtil from "#app/utils/WeatherUtil";


// type EnergyUseProps = {fields: any};


const getPyodide = async () => {
	// console.log(__dirname);
	// public folder needed in path because it is in NodeJS instead of the browser:
	// return await pyodideModule.loadPyodide({
	// 	indexURL: `${}/pyodide-env/`,
	// })
}

getPyodide();

// const runPythonScript = async () => {
// 	const pyodide: any = await getPyodide()
// 	// console.log(engine);
// 	// await pyodide.loadPackage('numpy')

// 	/* NOTES for pyodide-core:
// 		  need to be a special version from the release page, no pure whl: https://github.com/pydantic/pydantic-core/pull/128
// 		  get it from https://github.com/pydantic/pydantic-core/releases e.g. https://github.com/pydantic/pydantic-core/releases/download/v2.14.5/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl
// 	*/
// 	await pyodide.loadPackage(
// 		'public/pyodide-env/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl',
// 	)

// 	/* NOTES for pydantic, typing-extensions, annotated_types: 
// 		pyodide should match pyodide-core somewhat. 
// 		typing-extensions needs specific version per https://github.com/pyodide/pyodide/issues/4234#issuecomment-1771735148
// 		try getting it from 
// 		   - https://pypi.org/project/pydantic/#files
// 		   - https://pypi.org/project/typing-extensions/
// 		   - https://pypi.org/project/annotated-types/#files
// 	*/
// 	await pyodide.loadPackage(
// 		'public/pyodide-env/pydantic-2.5.2-py3-none-any.whl',
// 	)
// 	await pyodide.loadPackage(
// 		'public/pyodide-env/typing_extensions-4.8.0-py3-none-any.whl',
// 	)
// 	await pyodide.loadPackage(
// 		'public/pyodide-env/annotated_types-0.5.0-py3-none-any.whl',
// 	)

// 	/* NOTES FOR DEBUGGING new requirements.txt
// 		  and getting specific versions of pure whl */
// 	// the below works but uses the internet/pypi content delivery network rather than localhost.
// 	// await pyodide.loadPackage('micropip')
// 	// const micropip = await pyodide.pyimport('micropip')
// 	// await micropip.install([
// 	// 	'typing-extensions==4.8.0',
// 	// 	'pydantic_core==2.14.5',
// 	// 	'pydantic==2.5.2',
// 	// ])
// 	// await micropip.install(['annotated-types'])

// 	await pyodide.loadPackage(
// 		'../rules-engine/dist/rules_engine-0.0.1-py3-none-any.whl',
// 	)

// 	return pyodide
// }

// const pyodide: any = await runPythonScript()

// const executePy = await pyodide.runPythonAsync(`
// 	from rules_engine import parser
// 	from rules_engine.pydantic_models import (
// 	    FuelType,
// 	    SummaryInput,
// 	    TemperatureInput
// 	)
// 	from rules_engine import engine

// 	def execute(summaryInputJs, temperatureInputJs, csvDataJs):
		
// 	    summaryInputFromJs = summaryInputJs.as_object_map().values()._mapping
// 	    temperatureInputFromJs =temperatureInputJs.as_object_map().values()._mapping

// 	    naturalGasInputRecords = parser.parse_gas_bill(csvDataJs, parser.NaturalGasCompany.NATIONAL_GRID)


// 	    summaryInput = SummaryInput(**summaryInputFromJs)
// 	    temperatureInput = TemperatureInput(**temperatureInputFromJs)

// 	    outputs = engine.get_outputs_natural_gas(summaryInput, temperatureInput, naturalGasInputRecords)

// 	    return outputs.model_dump(mode="json")
// 	execute
// `)

const Thing = lazy(() => import("./pyodide.client.tsx"));

// export function EnergyUseHistory(props: EnergyUseProps) {
export function EnergyUseHistory() {
	const titleClass = 'text-5xl font-extrabold tracking-wide mt-10'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'
	// const location = useLocation();
	// console.log(location);

	return (
		
		<div>
			<h2 className={`${titleClass}`}>Energy Use History</h2>
			<div>
				<Suspense fallback={'<div>Blah</div>'}>
					<Thing/>
					<input
						id="energy_use_upload"
						aria-label="Upload your energy billing company's bill."
						onChange={async event => {
							const file = event.target.files?.[0]
							if (file) {
								// const reader = new FileReader()
								// reader.onloadend = async (event) => {
								// 	console.log('reader.result', reader.result)
								// }
								// reader.readAsText(file)	
								
								// const GU = new GeocodeUtil();
								// const address = "1 Broadway, Cambridge, MA 02142";
								// let { x, y } = await GU.getLL(address);

								// const WU = new WeatherUtil();
								// const TIWD = await WU.getThatWeathaData(x, y, "2024-03-20", "2024-04-20");
								// const datesFromTIWD = TIWD.dates.map(datestring => new Date(datestring).toISOString().split('T')[0])
								// const convertedDatesTIWD = {dates: datesFromTIWD, temperatures: TIWD.temperatures}

								// console.log( `convertedDatesTIWD:`, convertedDatesTIWD );

								// const exampleNationalGridCSV = `Name,FIRST LAST,,,,,
								// Address,"100 STREET AVE, BOSTON MA 02130",,,,,
								// Account Number,1111111111,,,,,
								// Service,Service 1,,,,,
								// ,,,,,,
								// TYPE,START DATE,END DATE,USAGE,UNITS,COST,NOTES
								// Natural gas billing,10/2/2020,11/4/2020,29,therms,$42.08 ,
								// Natural gas billing,11/5/2020,12/3/2020,36,therms,$65.60 ,
								// Natural gas billing,12/4/2020,1/7/2021,97,therms,$159.49 ,
								// Natural gas billing,1/8/2021,2/5/2021,105,therms,$169.09 ,
								// Natural gas billing,2/6/2021,3/5/2021,98,therms,$158.19 ,
								// Natural gas billing,3/6/2021,4/6/2021,66,therms,$111.79 ,
								// Natural gas billing,4/7/2021,5/5/2021,22,therms,$43.16 ,
								// Natural gas billing,5/6/2021,6/7/2021,19,therms,$32.42 ,
								// Natural gas billing,6/8/2021,7/6/2021,7,therms,$18.68 ,
								// Natural gas billing,7/7/2021,8/4/2021,10,therms,$21.73 ,
								// Natural gas billing,8/5/2021,9/8/2021,11,therms,$25.35 ,
								// Natural gas billing,9/9/2021,10/5/2021,8,therms,$19.58 ,
								// Natural gas billing,10/6/2021,11/3/2021,13,therms,$27.10 ,
								// Natural gas billing,11/4/2021,12/6/2021,41,therms,$87.45 ,
								// Natural gas billing,12/7/2021,1/5/2022,86,therms,$171.92 ,
								// Natural gas billing,1/6/2022,2/3/2022,132,therms,$248.63 ,
								// Natural gas billing,2/4/2022,3/7/2022,116,therms,$226.66 ,
								// Natural gas billing,3/8/2022,4/4/2022,49,therms,$109.44 ,
								// Natural gas billing,4/5/2022,5/5/2022,39,therms,$87.54 ,
								// Natural gas billing,5/6/2022,6/6/2022,20,therms,$44.30 ,
								// Natural gas billing,6/7/2022,7/5/2022,9,therms,$27.71 ,
								// Natural gas billing,7/6/2022,8/3/2022,7,therms,$23.86 ,
								// Natural gas billing,8/4/2022,9/3/2022,8,therms,$24.04 ,
								// Natural gas billing,9/4/2022,10/3/2022,8,therms,$26.41 ,
								// Natural gas billing,10/4/2022,11/3/2022,19,therms,$48.92 ,`
							
								// // NaturalGasCompany = National Grid is 2 for now
								// const exampleNationalGridNaturalGasCompany = "2"
							
								// // csv is 1st arg. 2nd arg should have a selection of whether Eversource (1) or National Grid (2).
								// // rules engine-returned objects can be modified and passed back to rules engine
							
								// const summaryInput = {
								// 	living_area: 2155,
								// 	fuel_type: "GAS",
								// 	heating_system_efficiency: 0.97,
								// 	thermostat_set_point: 68.0,
								// 	setback_temperature: null,
								// 	setback_hours_per_day: null,
								// 	// TODO: https://github.com/codeforboston/home-energy-analysis-tool/issues/123
								// 	design_temperature: 9.5,
								// }

								// const result = executePy(summaryInput, convertedDatesTIWD, exampleNationalGridCSV);
								// console.log( result );
							} else {
								// setPreviewImage(null)
							}
							console.log('Boom!')
						}}
						name="energy_use_upload"
						type="file"
						accept="text/csv"
					/>
					<Button type="submit"> <Upload className="h-4 w-4 mr-2" /> Upload</Button>
				</Suspense>
			</div>
			<AnalysisHeader />
			<EnergyUseHistoryChart />
		</div>
	)
}



// const file = event.target.files?.[0]

// if (file) {
// 	const reader = new FileReader()
// 	reader.onloadend = () => {
// 		setPreviewImage(reader.result as string)
// 	}
// 	reader.readAsDataURL(file)
// } else {
// 	setPreviewImage(null)
// }