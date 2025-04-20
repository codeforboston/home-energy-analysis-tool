//heat-stack/app/routes/_heat+/single.tsx
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import React, { useState } from 'react'
import { Form } from 'react-router'
import { type z } from 'zod'
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { replacer, reviver } from '#app/utils/data-parser.ts'
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import {
	fileUploadHandler,
	uploadHandler,
} from '#app/utils/file-upload-handler.ts'
import {
	buildCurrentUsageData,
	objectToString,
	hasDataProperty,
	hasParsedAndValidatedFormSchemaProperty,
} from '#app/utils/index.ts'
import { recalculateFromBillingRecordsChange } from '#app/utils/recalculateFromBillingRecordsChange.ts'

import {
	cleanupPyodideResources,
	executeGetAnalyticsFromFormJs,
	executeParseGasBillPy,
} from '#app/utils/rules-engine.ts'

// Ours
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import {
	HomeSchema,
	LocationSchema,
	CaseSchema /* validateNaturalGasUsageData, HeatLoadAnalysisZod */,
} from '../../../types/index.ts'
import {
	type UsageDataSchema,
	type NaturalGasUsageDataSchema,
} from '../../../types/types.ts'
import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { EnergyUseUpload } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseUpload.tsx'
import { HeatLoadAnalysis } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'

import { type Route } from './+types/single.tsx'

/** TODO: Use url param "dev" to set defaults */

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */

const HomeFormSchema = HomeSchema.pick({ living_area: true })
	.and(LocationSchema.pick({ address: true }))
	.and(CaseSchema.pick({ name: true }))

const CurrentHeatingSystemSchema = HomeSchema.pick({
	fuel_type: true,
	heating_system_efficiency: true,
	design_temperature_override: true,
	thermostat_set_point: true,
	setback_temperature: true,
	setback_hours_per_day: true,
})

export const Schema = HomeFormSchema.and(
	CurrentHeatingSystemSchema,
) /* .and(HeatLoadAnalysisZod.pick({design_temperature: true})) */

export async function loader({ request }: Route.LoaderArgs) {
	let url = new URL(request.url)
	let isDevMode: boolean = url.searchParams.get('dev')?.toLowerCase() === 'true'
	return { isDevMode }
}

export async function action({ request, params }: Route.ActionArgs) {
	// Checks if url has a homeId parameter, throws 400 if not there
	// invariantResponse(params.homeId, 'homeId param is required')
	const formData = await parseMultipartFormData(request, uploadHandler)
	const uploadedTextFile: string = await fileUploadHandler(formData)

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

	// CSV entrypoint parse_gas_bill(data: str, company: NaturalGasCompany)
	// Main form entrypoint

	type SchemaZodFromFormType = z.infer<typeof Schema>

	const parsedAndValidatedFormSchema: SchemaZodFromFormType = Schema.parse({
		living_area: living_area,
		address,
		name: `${name}'s home`,
		fuel_type,
		heating_system_efficiency,
		thermostat_set_point,
		setback_temperature,
		setback_hours_per_day,
		design_temperature_override,
		// design_temperature: 12 /* TODO:  see #162 and esp. #123*/
	})

	// This assignment of the same name is a special thing. We don't remember the name right now.
	// It's not necessary, but it is possible.
	const pyodideResultsFromTextFilePyProxy: PyProxy =
		executeParseGasBillPy(uploadedTextFile)
	const pyodideResultsFromTextFile: NaturalGasUsageDataSchema =
		executeParseGasBillPy(uploadedTextFile).toJs()
	pyodideResultsFromTextFilePyProxy.destroy()

	/** This function takes a CSV string and an address
	 * and returns date and weather data,
	 * and geolocation information
	 */
	const { convertedDatesTIWD, state_id, county_id } =
		await getConvertedDatesTIWD(pyodideResultsFromTextFile, address)

	/** Main form entrypoint
	 */

	// Call to the rules-engine with raw text file
	const gasBillDataFromTextFilePyProxy: PyProxy = executeGetAnalyticsFromFormJs(
		parsedAndValidatedFormSchema,
		convertedDatesTIWD,
		uploadedTextFile,
		state_id,
		county_id,
	)
	const gasBillDataFromTextFile = gasBillDataFromTextFilePyProxy.toJs()
	gasBillDataFromTextFilePyProxy.destroy()

	console.log(
		'***** Rules-engine Output from CSV upload:',
		gasBillDataFromTextFile,
	)

	// Call to the rules-engine with adjusted data (see checkbox implementation in recalculateFromBillingRecordsChange)
	// const calculatedData: any = executeRoundtripAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, gasBillDataFromTextFile, state_id, county_id).toJs()

	const str_version = JSON.stringify(gasBillDataFromTextFile, replacer)

	return {
		data: str_version,
		parsedAndValidatedFormSchema,
		convertedDatesTIWD,
		state_id,
		county_id,
	}
	// return redirect(`/single`)
} //END OF action

export default function SubmitAnalysis({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	// USAGE OF lastResult
	// console.log("lastResult (all Rules Engine data)", lastResult !== undefined ? JSON.parse(lastResult.data, reviver): undefined)

	/**
     * Example Data Returned
     * Where temp1 is a temporary variable with the main Map of Maps (or undefined if page not yet submitted).
     * 
     * 1 of 3: heat_load_output
     * console.log("Summary Output", lastResult !== undefined ? JSON.parse(lastResult.data, reviver)?.get('heat_load_output'): undefined)
     * 
     * temp1.get('heat_load_output'): Map(9) { 
        * estimated_balance_point → 61.5, 
        * other_fuel_usage → 0.2857142857142857, 
        * average_indoor_temperature → 67, 
        * difference_between_ti_and_tbp → 5.5, 
        * design_temperature → 1, 
        * whole_home_heat_loss_rate → 48001.81184312083, 
        * standard_deviation_of_heat_loss_rate → 0.08066745182677547, 
        * average_heat_load → 3048115.0520381727, 
        * maximum_heat_load → 3312125.0171753373 
     * }
     * 
     * 
     * 2 of 3: processed_energy_bills
     * console.log("EnergyUseHistoryChart table data", lastResult !== undefined ? JSON.parse(lastResult.data, reviver)?.get('processed_energy_bills'): undefined)
     *
     * temp1.get('processed_energy_bills')
     * Array(25) [ Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), … ]
     * 
     * temp1.get('processed_energy_bills')[0]
     * Map(9) { period_start_date → "2020-10-02", period_end_date → "2020-11-04", usage → 29, analysis_type_override → null, inclusion_override → true, analysis_type → 0, default_inclusion → false, eliminated_as_outlier → false, whole_home_heat_loss_rate → null }
     * 
     * temp1.get('processed_energy_bills')[0].get('period_start_date')
     * "2020-10-02" 
     * 
     * 
     * 3 of 3: balance_point_graph
     * console.log("HeatLoad chart", lastResult !== undefined ? JSON.parse(lastResult.data, reviver)?.get('balance_point_graph')?.get('records'): undefined) 
     * 
     * temp1.get('balance_point_graph').get('records')
        Array(23) [ Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), … ]
        temp1.get('balance_point_graph').get('records')[0]
        Map(5) { balance_point → 60, heat_loss_rate → 51056.8007761249, change_in_heat_loss_rate → 0, percent_change_in_heat_loss_rate → 0, standard_deviation → 0.17628334816871494 }
        temp1.get('balance_point_graph').get('records')[0].get('heat_loss_rate') 
     */
	const [usageData, setUsageData] = useState<UsageDataSchema | undefined>()
	const [tally, setTally] = useState(0)

	React.useEffect(() => {
		return () => {
			// Memory cleanup of pyodide fn's when component unmounts
			cleanupPyodideResources()
		}
	}, [])

	const lastResult = actionData

	let showUsageData = lastResult !== undefined

	let parsedLastResult: Map<any, any> | undefined

	if (showUsageData && hasDataProperty(lastResult)) {
		// Parse the JSON string from lastResult.data
		// const parsedLastResult = JSON.parse(lastResult.data, reviver) as Map<any, any>;
		parsedLastResult = JSON.parse(lastResult.data, reviver) as Map<any, any>

		const newUsageData =
			parsedLastResult && buildCurrentUsageData(parsedLastResult)
		if (tally < 4) {
			setTally(tally + 1)
			setUsageData((prevUsageData) => {
				if (objectToString(prevUsageData) != objectToString(newUsageData)) {
					return newUsageData
				}
				return prevUsageData
			})
		}
	}

	type SchemaZodFromFormType = z.infer<typeof Schema>
	console.log(loaderData, 'loader data', loaderData.isDevMode)

	type MinimalFormData = {
		fuel_type: 'GAS'
	}
	const defaultValue: SchemaZodFromFormType | MinimalFormData | undefined =
		loaderData.isDevMode
			? {
					living_area: 2155,
					address: '15 Dale Ave Gloucester, MA  01930',
					name: 'CIC',
					fuel_type: 'GAS',
					heating_system_efficiency: 0.97,
					thermostat_set_point: 68,
					setback_temperature: 65,
					setback_hours_per_day: 8,
					// design_temperature_override: '',
				}
			: { fuel_type: 'GAS' }

	const [form, fields] = useForm({
		/* removed lastResult , consider re-adding https://conform.guide/api/react/useForm#options */

		onValidate({ formData }) {
			return parseWithZod(formData, { schema: Schema })
		},
		defaultValue,
		shouldValidate: 'onBlur',
	})

	// @TODO: we might need to guarantee that Data exists before rendering - currently we need to typecast an empty object in order to pass typechecking for <EnergyUsHistory />
	return (
		<>
			<Form
				id={form.id}
				method="post"
				onSubmit={form.onSubmit}
				action="/single"
				encType="multipart/form-data"
			>
				{' '}
				{/* https://github.com/edmundhung/conform/discussions/547 instructions on how to properly set default values
            This will make it work when JavaScript is turned off as well 
            <Input {...getInputProps(props.fields.address, { type: "text" })} /> */}
				<HomeInformation fields={fields} />
				<CurrentHeatingSystem fields={fields} />
				{/* if no usage data, show the file upload functionality */}
				<EnergyUseUpload />
				<ErrorList id={form.errorId} errors={form.errors} />
				{showUsageData && (
					<>
						<EnergyUseHistory
							usageData={(usageData || {}) as UsageDataSchema}
							setUsageData={setUsageData}
							lastResult={lastResult}
							parsedLastResult={parsedLastResult}
							recalculateFn={recalculateFromBillingRecordsChange}
							showUsageData={showUsageData}
						/>

						{/* Replace regular HeatLoadAnalysis with our debug wrapper */}
						{usageData &&
						usageData.heat_load_output &&
						usageData.heat_load_output.design_temperature &&
						usageData.heat_load_output.whole_home_heat_loss_rate &&
						hasParsedAndValidatedFormSchemaProperty(lastResult) ? (
							<HeatLoadAnalysis
								heatLoadSummaryOutput={usageData.heat_load_output}
								livingArea={lastResult.parsedAndValidatedFormSchema.living_area}
							/>
						) : (
							<div className="my-4 rounded-lg border-2 border-red-400 p-4">
								<h2 className="mb-4 text-xl font-bold text-red-600">
									Not rendering Heat Load
								</h2>
								<p>usageData is undefined or null</p>
							</div>
						)}
					</>
				)}
			</Form>
		</>
	)
}
