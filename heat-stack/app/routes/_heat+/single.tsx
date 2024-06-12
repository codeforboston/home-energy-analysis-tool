/** THE BELOW PROBABLY NEEDS TO MOVE TO A ROUTE RATHER THAN A COMPONENT, including action function, */
// import { redirect } from '@remix-run/react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json, ActionFunctionArgs } from '@remix-run/node'
import { Form, redirect, useActionData } from '@remix-run/react'
import { z } from 'zod'
import GeocodeUtil from '#app/utils/GeocodeUtil'
import WeatherUtil from '#app/utils/WeatherUtil'
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
// - [x] Zod error at these three lines in Genny because the .optional() zod setting (see ./types/index.tsx) is getting lost somehow, refactor as much of genny away as possible: thermostat_set_point: oldSummaryInput.thermostat_set_point, setback_temperature: oldSummaryInput.setback_temperature, setback_hours_per_day: oldSummaryInput.setback_hours_per_day,
// - [skipped] Display Conform's form-wide errors, currently thrown away (if we think of a use case - 2 fields conflicting...)
// - [ ] #162: Pass CSV and form data to rules engine
// - [Waiting] Use start_date and end_date from rules-engine output of CSV parsing rather than 2 year window. 
// - [ ] (use data passing function API from PR#172 from rules engine) to Build table component form
// - [ ] Michelle proposes always set form default values when run in development
// - [ ] Pass modified table back to rules engine for full cycle revalidation 
// - [ ] Feature v2: How about a dropdown? census geocoder address form picker component to choose which address from several, if ambigous or bad.
// - [ ] Treat design_temperature distinctly from design_temperature_override, and design_temperature_override should be kept in state like name or address

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

const HomeFormSchema = Home.pick({ living_area: true })
	.and(Location.pick({ address: true }))
	.and(Case.pick({ name: true }))

const CurrentHeatingSystemSchema = Home.pick({
	fuel_type: true,
	heating_system_efficiency: true,
	design_temperature_override: true,
	thermostat_set_point: true,
	setback_temperature: true,
	setback_hours_per_day: true,
})

const Schema = HomeFormSchema.and(CurrentHeatingSystemSchema)

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
		living_area,
		fuel_type,
		heating_system_efficiency,
		thermostat_set_point,
		setback_temperature,
		setback_hours_per_day,
		design_temperature_override,
	} = submission.value

	// await updateNote({ id: params.noteId, title, content })
	//code snippet from - https://github.com/epicweb-dev/web-forms/blob/2c10993e4acffe3dd9ad7b9cb0cdf89ce8d46ecf/exercises/04.file-upload/01.solution.multi-part/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L180

	// const formData = await parseMultipartFormData(
	// 	request,
	// 	createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	// )

	console.log('loading PU/PM/GU/WU')

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
		return pyodide
	}
	// consider running https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/tests/test_rules_engine/test_engine.py
	const pyodide: any = await runPythonScript()
	//////////////////////

	let { x, y } = await GU.getLL(address)
	console.log('geocoded', x, y)

	// let { SI, TIWD, BI } = await genny(x, y, '2024-01-01', '2024-01-03')

	// PU.runit(SI,null,TIWD,JSON.stringify(BI));
	// CSV entrypoint parse_gas_bill(data: str, company: NaturalGasCompany)
	// Main form entrypoint

	type SchemaZodFromFormType = z.infer<typeof Schema>

	const SI: SchemaZodFromFormType = Schema.parse({
		living_area: living_area,
		address,
		name: 'My Home',
		fuel_type,
		heating_system_efficiency,
		thermostat_set_point,
		setback_temperature,
		setback_hours_per_day,
		design_temperature_override,
	})

	console.log('SI', SI)

	// Get today's date
	const today = new Date();

	// Calculate the date 2 years ago from today
	const twoYearsAgo = new Date(today);
	twoYearsAgo.setFullYear(today.getFullYear() - 2);

	// Set the start_date and end_date
	const start_date = twoYearsAgo;
	const end_date = today;

	// const TIWD: TemperatureInput = await WU.getThatWeathaData(longitude, latitude, start_date, end_date);
	const TIWD = await WU.getThatWeathaData(
		x,
		y,
		start_date.toISOString().split('T')[0],
		end_date.toISOString().split('T')[0]
	)
	const BI = [
		{
			period_start_date: new Date('2023-12-30'), //new Date("2023-12-30"),
			period_end_date: new Date('2024-01-06'),
			usage: 100,
			inclusion_override: null,
		},
	]

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
			living_area: 3000,
			address: '1 Broadway, Cambridge, MA 02142',
			name: 'CIC',
			fuel_type: 'Natural Gas',
			heating_system_efficiency: 85,
			thermostat_set_point: 68,
			setback_temperature: 65,
			setback_hours_per_day: 8,
			// design_temperature_override: '',
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
