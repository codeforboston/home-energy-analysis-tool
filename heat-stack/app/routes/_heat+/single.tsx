//heat-stack/app/routes/_heat+/single.tsx
import { type SubmissionResult, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import React, { useState } from 'react'
import { Form, data } from 'react-router'
import { type z } from 'zod'
import { EnergyUseHistoryChart } from '#app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx'
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { replacer, reviver } from '#app/utils/data-parser.ts'
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import { prisma } from '#app/utils/db.server.ts'
import {
	fileUploadHandler,
	uploadHandler,
} from '#app/utils/file-upload-handler.ts'
import { useRulesEngine } from '#app/utils/hooks/use-rules-engine.ts'
import {
	buildCurrentUsageData,
	objectToString,
	hasDataProperty,
	hasParsedAndValidatedFormSchemaProperty,
} from '#app/utils/index.ts'
import {
	executeGetAnalyticsFromFormJs,
	executeParseGasBillPy,
} from '#app/utils/rules-engine.ts'

// Ours
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import {
	HomeSchema,
	LocationSchema,
	CaseSchema, /* validateNaturalGasUsageData, HeatLoadAnalysisZod */
	UploadEnergyUseFileSchema,
} from '../../../types/index.ts'
import {
	type UsageDataSchema,
	type NaturalGasUsageDataSchema,
} from '../../../types/types.ts'
import { AnalysisHeader } from '../../components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx'
import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseUpload } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseUpload.tsx'
import { HeatLoadAnalysis } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'

import { type Route } from './+types/single.ts'

/** TODO: Use url param "dev" to set defaults */

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */

const HomeFormSchema = HomeSchema.pick({ living_area: true })
	.and(LocationSchema.pick({ street_address: true, town: true, state: true }))
	.and(CaseSchema.pick({ name: true }))

const CurrentHeatingSystemSchema = HomeSchema.pick({
	fuel_type: true,
	heating_system_efficiency: true,
	design_temperature_override: true,
	thermostat_set_point: true,
	setback_temperature: true,
	setback_hours_per_day: true,
})


export const Schema = UploadEnergyUseFileSchema.and(HomeFormSchema.and(
	CurrentHeatingSystemSchema)
) /* .and(HeatLoadAnalysisZod.pick({design_temperature: true})) */

export async function loader({ request }: Route.LoaderArgs) {
	let url = new URL(request.url)
	let isDevMode: boolean = url.searchParams.get('dev')?.toLowerCase() === 'true'
	return { isDevMode }
}

/* consolidate into FEATUREFLAG_PRISMA_HEAT_BETA2 when extracted into sep. file, export it */
export interface CaseInfo {
	caseId?: number;
	analysisId?: number;
	heatingInputId?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		street_address,
		town,
		state,
		living_area,
		fuel_type,
		heating_system_efficiency,
		thermostat_set_point,
		setback_temperature,
		setback_hours_per_day,
		design_temperature_override,
		energy_use_upload
	} = submission.value

	// await updateNote({ id: params.noteId, title, content })
	//code snippet from - https://github.com/epicweb-dev/web-forms/blob/2c10993e4acffe3dd9ad7b9cb0cdf89ce8d46ecf/exercises/04.file-upload/01.solution.multi-part/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L180

	// CSV entrypoint parse_gas_bill(data: str, company: NaturalGasCompany)
	// Main form entrypoint

	type SchemaZodFromFormType = z.infer<typeof Schema>

	const parsedAndValidatedFormSchema: SchemaZodFromFormType = Schema.parse({
		living_area: living_area,
		street_address,
		town,
		state,
		name: `${name}'s home`,
		fuel_type,
		heating_system_efficiency,
		thermostat_set_point,
		setback_temperature,
		setback_hours_per_day,
		design_temperature_override,
		energy_use_upload
		// design_temperature: 12 /* TODO:  see #162 and esp. #123*/
	})

	try {
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

		let convertedDatesTIWD, state_id, county_id
		// Define variables at function scope for access in the return statement
		let caseRecord, analysis, heatingInput
		const result = await getConvertedDatesTIWD(
			pyodideResultsFromTextFile,
			street_address,
			town,
			state
		)
		convertedDatesTIWD = result.convertedDatesTIWD
		state_id = result.state_id
		county_id = result.county_id

		if (process.env.FEATUREFLAG_PRISMA_HEAT_BETA2 === "true") {
			/* TODO: refactor out into a separate file. 
					for args, use submission.values, result
			*/
			// Save to database using Prisma
			// First create or find HomeOwner
			const homeOwner = await prisma.homeOwner.create({
				data: {
					firstName1: name.split(' ')[0] || 'Unknown',
					lastName1: name.split(' ').slice(1).join(' ') || 'Owner',
					email1: '', // We'll need to add these to the form
					firstName2: '',
					lastName2: '',
					email2: '',
				},
			})

			// Create location using geocoded information
			const location = await prisma.location.create({
				data: {
					address: result.addressComponents?.street || street_address,
					city: result.addressComponents?.city || town,
					state: result.addressComponents?.state || state,
					zipcode: result.addressComponents?.zip || '',
					country: 'USA',
					livingAreaSquareFeet: Math.round(living_area),
					latitude: result.coordinates?.y || 0,
					longitude: result.coordinates?.x || 0,
				},
			})

			// Create Case
			caseRecord = await prisma.case.create({
				data: {
					homeOwnerId: homeOwner.id,
					locationId: location.id,
				},
			})

			// Create Analysis
			analysis = await prisma.analysis.create({
				data: {
					caseId: caseRecord.id,
					rules_engine_version: '0.0.1',
				},
			})

			// Create HeatingInput
			heatingInput = await prisma.heatingInput.create({
				data: {
					analysisId: analysis.id,
					fuelType: fuel_type,
					designTemperatureOverride: Boolean(design_temperature_override),
					heatingSystemEfficiency: Math.round(heating_system_efficiency * 100),
					thermostatSetPoint: thermostat_set_point,
					setbackTemperature: setback_temperature || 65,
					setbackHoursPerDay: setback_hours_per_day || 0,
					numberOfOccupants: 2, // Default value until we add to form
					estimatedWaterHeatingEfficiency: 80, // Default value until we add to form
					standByLosses: 5, // Default value until we add to form
					livingArea: living_area,
				},
			})

			/* TODO: store uploadedTextFile CSV/XML raw into AnalysisDataFile table */

			/* TODO: store rules-engine output in database too */
		}


		// } catch (error) {
		// 	const errorWithExceptionMessage = error as ErrorWithExceptionMessage
		// 	if (errorWithExceptionMessage && errorWithExceptionMessage.exceptionMessage) {
		// 		return { exceptionMessage: errorWithExceptionMessage.exceptionMessage }
		// 	}
		// 	throw error
		// }

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

		// Call to the rules-engine with adjusted data (see checkbox implementation in recalculateFromBillingRecordsChange)
		// const calculatedData: any = executeRoundtripAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, gasBillDataFromTextFile, state_id, county_id).toJs()

		const str_version = JSON.stringify(gasBillDataFromTextFile, replacer)

		return {
			data: str_version,
			parsedAndValidatedFormSchema,
			convertedDatesTIWD,
			state_id,
			county_id,
			// Return case information for linking to case details
			caseInfo: {
				caseId: caseRecord?.id,
				analysisId: analysis?.id,
				heatingInputId: heatingInput?.id
			}
		}
	}
	catch (error: unknown) {
		console.error("Calculate failed")
		if (error instanceof Error) {
			console.error(error.message)
			const errorLines = error.message.split("\n").filter(Boolean)
			const lastLine = errorLines[errorLines.length - 1] || error.message
			return data(
				// see comment for first submission.reply for additional options
				submission.reply({
					formErrors: [lastLine],
				}),
				{ status: 500 }
			);
		} else {
			return data(
				// see comment for first submission.reply for additional options
				submission.reply({
					formErrors: ['Unknown Error'],
				}),
				{ status: 500 }
			);
		}
	}
	// return redirect(`/single`)
} //END OF action


export default function SubmitAnalysis({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const [usageData, setUsageData] = useState<UsageDataSchema | undefined>()
	const [scrollAfterSubmit, setScrollAfterSubmit] = useState(false)
	const [buildAfterSubmit, setBuildAfterSubmit] = useState(false)
	const [savedCase, setSavedCase] = useState<CaseInfo | undefined>()
	const [newResult, setNewResult] = useState<Map<any, any> | undefined>()
	const { lazyLoadRulesEngine, recalculateFromBillingRecordsChange } = useRulesEngine()

	// ✅ Extract structured values from actionData
	const lastResult = actionData // The actual submission result
	const caseInfo = (actionData as typeof actionData & { caseInfo?: CaseInfo })?.caseInfo

	React.useEffect(() => {
		if (caseInfo) {
			setSavedCase(caseInfo)
		}
	}, [caseInfo])

	const showUsageData = lastResult !== undefined

	if (showUsageData && hasDataProperty(lastResult) && buildAfterSubmit) {
		setNewResult(JSON.parse(lastResult.data, reviver) as Map<any, any>)
	};
	if (newResult && buildAfterSubmit) {
		setBuildAfterSubmit(false)
		const newUsageData = buildCurrentUsageData(newResult)
		// const v = newUsageData.processed_energy_bills;
		// console.log("single new",
		// 	v[0]?.inclusion_override,
		// 	v[1]?.inclusion_override,
		// 	v[2]?.inclusion_override,
		// )
		// const v2 = usageData?.processed_energy_bills || []
		// console.log("old",
		// 	v2[0]?.inclusion_override,
		// 	v[1]?.inclusion_override,
		// 	v[2]?.inclusion_override,
		// )
		// console.log("single.tsx setUsageData")
		// if (objectToString(usageData) !== objectToString(newUsageData)) {
		// 	console.log("new")
		if (objectToString(usageData) !== objectToString(newUsageData)) {
			setUsageData(newUsageData)
		}
	}

	type SchemaZodFromFormType = z.infer<typeof Schema>
	type MinimalFormData = { fuel_type: 'GAS' }

	const defaultValue: SchemaZodFromFormType | MinimalFormData | undefined =
		loaderData.isDevMode
			? {
				living_area: 2155,
				street_address: '15 Dale Ave',
				town: 'Gloucester',
				state: 'MA',
				name: 'CIC',
				fuel_type: 'GAS',
				heating_system_efficiency: 0.97,
				thermostat_set_point: 68,
				setback_temperature: 65,
				setback_hours_per_day: 8,
			}
			: { fuel_type: 'GAS' }

	// ✅ Pass `result` as `lastResult`
	const [form, fields] = useForm({
		lastResult: actionData as SubmissionResult<string[]>,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: Schema })
		},
		onSubmit() {
			lazyLoadRulesEngine()
		},
		defaultValue,
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})


	return (
		<>
			<Form
				id={form.id}
				method="post"
				onSubmit={form.onSubmit}
				action="/single"
				encType="multipart/form-data"
				aria-invalid={form.errors ? true : undefined}
				aria-describedby={form.errors ? form.errorId : undefined}
			>
				<div>Case {savedCase?.caseId}</div>
				<HomeInformation fields={fields} />
				<CurrentHeatingSystem fields={fields} />
				<EnergyUseUpload setBuildAfterSubmit={setBuildAfterSubmit} setScrollAfterSubmit={setScrollAfterSubmit} fields={fields} />
				<ErrorList id={form.errorId} errors={form.errors} />

				{showUsageData && usageData && recalculateFromBillingRecordsChange && newResult && (
					<>
						<AnalysisHeader
							usageData={usageData}
							scrollAfterSubmit={scrollAfterSubmit}
							setScrollAfterSubmit={setScrollAfterSubmit}
						/>
						<EnergyUseHistoryChart
							usageData={usageData}
							setUsageData={setUsageData}
							lastResult={lastResult}
							parsedLastResult={newResult}
							recalculateFn={recalculateFromBillingRecordsChange}
						/>

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
								<p>usageData is undefined or missing key values</p>
							</div>
						)}
					</>
				)}
			</Form>
			{/* Show case saved message */}
			{savedCase && savedCase.caseId && (
				<div className="mt-8 rounded-lg border-2 border-green-400 bg-green-50 p-4">
					<h2 className="mb-2 text-xl font-bold text-green-700">Case Saved Successfully!</h2>
					<p className="mb-4">Your case data has been saved to the database.</p>
					<p>
						<a
							href={`/cases/${savedCase.caseId}`}
							className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
						>
							View Case Details
						</a>
					</p>
				</div>
			)}
		</>
	)
}

