/** THE BELOW PROBABLY NEEDS TO MOVE TO A ROUTE RATHER THAN A COMPONENT, including action function, */
// import { redirect } from '@remix-run/react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json, ActionFunctionArgs } from '@remix-run/node'
import { Form, redirect, useActionData } from '@remix-run/react'
import { z } from 'zod'
import GeocodeUtil from '#app/utils/GeocodeUtil.js'
import WeatherUtil from '#app/utils/WeatherUtil.js'
import PyodideUtil from '#app/utils/pyodide.util.js'
import * as pyodideModule from 'pyodide'

// TODO NEXT WEEK
// - [x] Server side error checking/handling
// - [x] ~Save to cookie and redirect to next form~ Put everything on the same page
// - [x] - Get zod and Typescript to play nice
// - [x] (We're here) Build form #2
// - [ ] Build upload form
//   - https://www.epicweb.dev/workshops/professional-web-forms/file-upload/intro-to-file-upload
//   - https://github.com/epicweb-dev/web-forms/tree/main/exercises/04.file-upload
//   - https://github.com/epicweb-dev/web-forms/blob/2c10993e4acffe3dd9ad7b9cb0cdf89ce8d46ecf/exercises/04.file-upload/01.solution.multi-part/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L58
//   - createMemoryUploadHandler
//   - parseMultipartFormData
//   - avoid dealing with the server for now
//   - pass the data to the rules engine/pyodide either in the component or the action (probably the action for validation, etc.)
// - [x] import pyodide into single.tsx and run it with genny
//     - [x] Add to README: don't forget `npm run buildpy` to build rules engine into `public/pyodide-env` if you start a new codingspace or on local.
// - [x] figure out how to set field defaults with Conform to speed up trials (defaultValue prop on input doesn't work) https://conform.guide/api/react/useForm
// - [x] (To reproduce: Fill out and submit form and go back and submit form again) How do we stop the geocoder helper from concatenating everyone's past submitted addresses onto querystring in single.tsx action? 
// example: [MSW] Warning: intercepted a request without a matching request handler: GET https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1+Broadway%2C+Cambridge%2C+MA+02142&format=json&benchmark=2020&address=1+Broadway%2C+Cambridge%2C+MA+02142&format=json&benchmark=2020
// - [ ] Zod error at these three lines in Genny because the .optional() zod setting (see ./types/index.tsx) is getting lost somehow, refactor as much of genny away as possible: thermostatSetPoint: oldSummaryInput.thermostat_set_point, setbackTemperature: oldSummaryInput.setback_temperature, setbackHoursPerDay: oldSummaryInput.setback_hours_per_day,
// - [ ] Display Conform's form-wide errors, currently thrown away (if we think of a use case - 2 fields conflicting...)
// - [ ] (use data passing function API from #172 from rules engine) to Build table component form
// - [ ] Michelle proposes always set form default values when run in development
// - [ ] Pass modified table back to rules engine for full cycle revalidation 
// - [ ] Feature v2: How about a dropdown? census geocoder address form picker component to choose which address from several, if ambigous or bad.

/**
 * ZodError: [
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "null",
    "path": [
      "setbackTemperature"
    ],
    "message": "Expected number, received null"
  },
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "null",
    "path": [
      "setbackHoursPerDay"
    ],
    "message": "Expected number, received null"
  }
]
    at Object.get error [as error] (file:///workspaces/home-energy-analysis-tool/heat-stack/node_modules/zod/lib/index.mjs:538:31)
    at ZodIntersection.parse (file:///workspaces/home-energy-analysis-tool/heat-stack/node_modules/zod/lib/index.mjs:638:22)
    at genny (file:///workspaces/home-energy-analysis-tool/heat-stack/build/index.js?update=1715733465459:7338:21)
    at action13 (file:///workspaces/home-energy-analysis-tool/heat-stack/build/index.js?update=1715733465459:7370:32)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at /workspaces/home-energy-analysis-tool/heat-stack/node_modules/@sentry/src/utils/instrumentServer.ts:266:36
    at Object.callRouteActionRR (/workspaces/home-energy-analysis-tool/heat-stack/node_modules/@remix-run/server-runtime/dist/data.js:35:16)
    at callLoaderOrAction (/workspaces/home-energy-analysis-tool/heat-stack/node_modules/@remix-run/router/router.ts:4011:16)
    at submit (/workspaces/home-energy-analysis-tool/heat-stack/node_modules/@remix-run/router/router.ts:3131:16)
    at queryImpl (/workspaces/home-energy-analysis-tool/heat-stack/node_modules/@remix-run/router/router.ts:3066:22)
 */


// Ours
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { Home, Location, Case } from '../../../types/index.ts'
import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'
import HeatLoadAnalysis from './heatloadanalysis.tsx'
import { Button } from '#/app/components/ui/button.tsx'

const nameMaxLength = 50
const addressMaxLength = 100

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */

// const HomeInformationSchema = {
// 	name: z.string().min(1).max(nameMaxLength),
// 	address: z.string().min(1).max(addressMaxLength),
// 	livingSpace: z.number().min(1),
// }
// // type Home = z.infer<typeof HomeSchema>

// // TODO Next: Ask an LLM how we get fuelType out of HomeSchema from zod

const HomeFormSchema = Home.pick({ livingArea: true })
	.and(Location.pick({ address: true }))
	.and(Case.pick({ name: true }))

const CurrentHeatingSystemSchema = Home.pick({
	fuelType: true,
	heatingSystemEfficiency: true,
	designTemperatureOverride: true,
	thermostatSetPoint: true,
	setbackTemperature: true,
	setbackHoursPerDay: true,
})

const Schema = HomeFormSchema.and(CurrentHeatingSystemSchema)

// const EnergyUseSchema = '';

export async function action({ request, params }: ActionFunctionArgs) {
	// Checks if url has a homeId parameter, throws 400 if not there
	// invariantResponse(params.homeId, 'homeId param is required')

	console.log('action started')

	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: Schema,
	})

	if (submission.status !== 'success') {
		if (process.env.NODE_ENV === 'development') {
			// this can have personal identifying information, so only active in development.
			console.error('submission failed', submission)
		}
		return submission.reply()
		// submission.reply({
		// 	// You can also pass additional error to the `reply` method
		// 	formErrors: ['Submission failed'],
		// 	fieldErrors: {
		// 		address: ['Address is invalid'],
		// 	},

		// 	// or avoid sending the the field value back to client by specifying the field names
		// 	hideFields: ['password'],
		// }),
		// {status: submission.status === "error" ? 400 : 200}
	}

	const {
		name,
		address,
		livingArea,
		fuelType,
		heatingSystemEfficiency,
		thermostatSetPoint,
		setbackTemperature,
		setbackHoursPerDay,
		designTemperatureOverride,
	} = submission.value

	// await updateNote({ id: params.noteId, title, content })
	//code snippet from - https://github.com/epicweb-dev/web-forms/blob/2c10993e4acffe3dd9ad7b9cb0cdf89ce8d46ecf/exercises/04.file-upload/01.solution.multi-part/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L180

	// const formData = await parseMultipartFormData(
	// 	request,
	// 	createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	// )

	console.log('loading PU/PM/GU/WU')

	// CONSOLE: loading PU/PM/GU/WU
	// Error: No known package with name 'pydantic_core'
	// Error: No known package with name 'pydantic_core'
	// 	at addPackageToLoad (/workspaces/home-energy-analysis-tool/heat-stack/public/pyodide-env/pyodide.asm.js:9:109097)
	// 	at recursiveDependencies (/workspaces/home-energy-analysis-tool/heat-stack/public/pyodide-env/pyodide.asm.js:9:109370)
	// 	at loadPackage (/workspaces/home-energy-analysis-tool/heat-stack/public/pyodide-env/pyodide.asm.js:9:111435)
	// 	at initializePackageIndex (/workspaces/home-energy-analysis-tool/heat-stack/public/pyodide-env/pyodide.asm.js:9:108508)

	// const PU = PyodideUtil.getInstance();
	// const PM = await PU.getPyodideModule();
	const GU = new GeocodeUtil()
	const WU = new WeatherUtil()
	// console.log("loaded PU/PM/GU/WU");
	////////////////////////
	const getPyodide = async () => {
		return await pyodideModule.loadPyodide({
			// This path is actually `public/pyodide-env`, but the browser knows where `public` is. Note that remix server needs `public/`
			// TODO: figure out how to determine if we're in browser or remix server and use ternary.
			indexURL: 'public/pyodide-env/',
		})
	}
	const runPythonScript = async () => {
		const pyodide: any = await getPyodide()
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

		return pyodide
	}
	// consider running https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/tests/test_rules_engine/test_engine.py
	const pyodide: any = await runPythonScript()
	//////////////////////

	/**
	 *
	 * @param longitude
	 * @param latitude
	 * @param start_date
	 * @param end_date
	 * @returns {SI,TIWD,BI} Summary input: hardcoded data.TIWD: TemperatureInput: WeatherData from calling open meto API
	 * Billing input: hardcoded data
	 *
	 * Function just to generate test data. inputs come from the values entered in from HomeInformation component
	 */
	async function genny(
		longitude: number,
		latitude: number,
		start_date: string,
		end_date: string,
	) {
		// SI = new SummaryInput(6666,"GAS",80,67,null,null,60);
		// was living_area: number, fuel_type: FuelType, heating_system_efficiency: number, thermostat_set_point: number, setback_temperature: number | null, setback_hours_per_day: number | null, design_temperature: number

		type SchemaZodFromFormType = z.infer<typeof Schema>

		const oldSummaryInput = {
			living_area: 6666,
			fuel_type: 'GAS',
			heating_system_efficiency: 80,
			thermostat_set_point: 67,
			setback_temperature: null,
			setback_hours_per_day: null,
			design_temperature: 60,
		}

		const SI: SchemaZodFromFormType = Schema.parse({
			livingArea: oldSummaryInput.living_area,
			address: '123 Main St', // Provide a valid address
			name: 'My Home', // Provide a valid name
			fuelType:
				oldSummaryInput.fuel_type === 'GAS'
					? 'Natural Gas'
					: oldSummaryInput.fuel_type,
			heatingSystemEfficiency: oldSummaryInput.heating_system_efficiency,
			thermostatSetPoint: oldSummaryInput.thermostat_set_point,
			setbackTemperature: oldSummaryInput.setback_temperature,
			setbackHoursPerDay: oldSummaryInput.setback_hours_per_day,
			designTemperatureOverride: oldSummaryInput.design_temperature,
		})

		console.log('SI', SI)

		// const TIWD: TemperatureInput = await WU.getThatWeathaData(longitude, latitude, start_date, end_date);
		const TIWD = await WU.getThatWeathaData(
			longitude,
			latitude,
			start_date,
			end_date,
		)
		const BI = [
			{
				period_start_date: new Date('2023-12-30'), //new Date("2023-12-30"),
				period_end_date: new Date('2024-01-06'),
				usage: 100,
				inclusion_override: null,
			},
		]
		return { SI, TIWD, BI }
	}

	let { x, y } = await GU.getLL(address)
	console.log('geocoded', x, y)

	let { SI, TIWD, BI } = await genny(x, y, '2024-01-01', '2024-01-03')

	// PU.runit(SI,null,TIWD,JSON.stringify(BI));
	// CSV entrypoint parse_gas_bill(data: str, company: NaturalGasCompany)
	// Main form entrypoint

	return redirect(`/single`)
}

export default function Inputs() {
	const lastResult = useActionData<typeof action>()
	type SchemaZodFromFormType = z.infer<typeof Schema>
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: Schema })
		},
		defaultValue: {
			livingArea: 3000,
			address: '1 Broadway, Cambridge, MA 02142',
			name: 'CIC',
			fuelType: 'Natural Gas',
			heatingSystemEfficiency: 85,
			thermostatSetPoint: 68,
			setbackTemperature: 65,
			setbackHoursPerDay: 8,
			// designTemperatureOverride: '',
		} as SchemaZodFromFormType,
		shouldValidate: 'onBlur',
	})

	return (
		<>
			<Form
				id={form.id}
				method="post"
				onSubmit={form.onSubmit}
				action="/single"
				encType="multipart/form-data"
			> {/* https://github.com/edmundhung/conform/discussions/547 instructions on how to properly set default values
			This will make it work when JavaScript is turned off as well 
			<Input {...getInputProps(props.fields.address, { type: "text" })} /> */}
				<HomeInformation fields={fields} />
				<CurrentHeatingSystem fields={fields} />
				<EnergyUseHistory />
				<ErrorList id={form.errorId} errors={form.errors} />
				<Button type="submit">Submit</Button>
			</Form>
			<HeatLoadAnalysis />
		</>
	)
}
