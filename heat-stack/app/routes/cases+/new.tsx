//heat-stack/app/routes/_heat+/single.tsx
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import React, { useState } from 'react'
import { Form, data } from 'react-router'
import { type z } from 'zod'
import { EnergyUseHistoryChart } from '#app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx'
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { getUserId } from '#app/utils/auth.server.ts'
import { replacer } from '#app/utils/data-parser.ts'
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import { createCaseData } from '#app/utils/db/case.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import {
	fileUploadHandler,
	uploadHandler,
} from '#app/utils/file-upload-handler.ts'
import { type RulesEngineActionData, useRulesEngine } from '#app/utils/hooks/use-rules-engine.ts'
import { hasParsedAndValidatedFormSchemaProperty } from '#app/utils/index.ts'
import {
	executeGetAnalyticsFromFormJs,
	executeParseGasBillPy,
} from '#app/utils/rules-engine.ts'

// Ours
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import { Schema, type SchemaZodFromFormType } from '#types/single-form.ts'
import {
	type NaturalGasUsageDataSchema,
} from '../../../types/types.ts'
import { AnalysisHeader } from '../../components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx'
import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseUpload } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseUpload.tsx'
import { HeatLoadAnalysis } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'

import { type Route } from './+types/new.ts'


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

 
export async function action({ request }: Route.ActionArgs) {
	const userId = await getUserId(request)
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
		return {submitResult: submission.reply()}
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

	// TODO: WI: Is this doing the same thing as parseWithZod?
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
		// TODO: WI: Create issue to investigate why we duplicate pyodide calls. Bad merge or duplicate of calls down below (see call to executeGetAnalyticsFromFormJs)
		// 			 Intention might have been 
		// 			 const pyodideResultsFromTextFilePyProxy: PyProxy =
		// 			 	executeParseGasBillPy(uploadedTextFile)
		// 			 const pyodideResultsFromTextFile: NaturalGasUsageDataSchema = pyodideResultsFromTextFilePyProxy.toJs()
		// 			 pyodideResultsFromTextFilePyProxy.destroy()
		const pyodideResultsFromTextFilePyProxy: PyProxy =
			executeParseGasBillPy(uploadedTextFile)
		const pyodideResultsFromTextFile: NaturalGasUsageDataSchema = pyodideResultsFromTextFilePyProxy.toJs()
		pyodideResultsFromTextFilePyProxy.destroy()

		/** This function takes a CSV string and an address
		 * and returns date and weather data,
		 * and geolocation information
		 */


		// Define variables at function scope for access in the return statement
		let caseRecord, analysis, heatingInput
		const result = await getConvertedDatesTIWD(
			pyodideResultsFromTextFile,
			street_address,
			town,
			state
		)

		const convertedDatesTIWD = result.convertedDatesTIWD
		const state_id = result.state_id
		const county_id = result.county_id

		if (process.env.FEATUREFLAG_PRISMA_HEAT_BETA2 === "true") {
			if(userId){
				const records = await createCaseData(submission.value, result, userId)
				caseRecord = records.caseRecord
				analysis = records.analysis
				heatingInput = records.heatingInput
				// TODO: WI: Make an issue to save csv but sanitize content (e.g. no usernames, address, account numbers) OR save the parsed csv
				// 			 PROBLEM: The rules engine needs the raw csv data (starting from the headers section and down) so we cant save the parsed data map from above
				// 		     IDEA: Save the output from rules engine to DB to avoid having to make any logic to sanitize csv or refactor python code to do similar work,
				// 				   In theory, saving output to db should just result in a json.parse.
				// 				   Do we ever need to save csv for a feature not currently or some other reason
				/* TODO: store uploadedTextFile CSV/XML raw into AnalysisDataFile table */
				// !!!!!!!!!!!!!!!!!!!!!!!!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!
				// ! IMPORTANT READ THE BELOW COMMENT
				//! TODO: Is this safe to save to DB? Aren't there accout numbers or PII in uploaded text files?
				// ! IMPORTANT READ THE ABOVE COMMENT
				// !!!!!!!!!!!!!!!!!!!!!!!!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!
				// TODO: WI: Replace saving the csv in the database (future feature) and instead 
				// 			 save the output from the rules engine to run calculations in the edit page
				// 			 WRITE AN ISSUE TO DISCUSS WHAT TO DO ABOUT SAVING CSVs IN V2 - TAG ETHAN

				/* TODO: store rules-engine output in database too */

			} else {
				// user is not logged in
			}
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
			submitResult:submission.reply(),
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
				{submitResult:submission.reply({
					formErrors: [lastLine],
				})},
				{ status: 500 }
			);
		} else {
			return data(
				// see comment for first submission.reply for additional options
				{submitResult:submission.reply({
					formErrors: ['Unknown Error'],
				})},
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
	const [scrollAfterSubmit, setScrollAfterSubmit] = useState(false)
	const [savedCase, setSavedCase] = useState<CaseInfo | undefined>()
	const {
		lazyLoadRulesEngine,
		recalculateFromBillingRecordsChange,
		usageData,
		toggleBillingPeriod,
	} = useRulesEngine(actionData as RulesEngineActionData)

	// ✅ Extract structured values from actionData
	const caseInfo = (actionData as typeof actionData & { caseInfo?: CaseInfo })?.caseInfo

	React.useEffect(() => {
		if (caseInfo) {
			setSavedCase(caseInfo)
		}
	}, [caseInfo])

	const showUsageData = actionData !== undefined

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
		lastResult: actionData?.submitResult,
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
				<EnergyUseUpload setScrollAfterSubmit={setScrollAfterSubmit} fields={fields} />
				<ErrorList id={form.errorId} errors={form.errors} />

				{showUsageData && usageData && recalculateFromBillingRecordsChange && (
					<>
						<AnalysisHeader
							usageData={usageData}
							scrollAfterSubmit={scrollAfterSubmit}
							setScrollAfterSubmit={setScrollAfterSubmit}
						/>
						<EnergyUseHistoryChart
							usageData={usageData}
							onClick={(index) => {
								toggleBillingPeriod(index)
							}}
						/>

						{usageData &&
						usageData.heat_load_output &&
						usageData.heat_load_output.design_temperature &&
						usageData.heat_load_output.whole_home_heat_loss_rate &&
						hasParsedAndValidatedFormSchemaProperty(actionData) ? (
							<HeatLoadAnalysis
								heatLoadSummaryOutput={usageData.heat_load_output}
								livingArea={actionData.parsedAndValidatedFormSchema.living_area}
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
