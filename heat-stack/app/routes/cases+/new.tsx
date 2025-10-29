import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import { data } from 'react-router'
import SingleCaseForm from '#app/components/ui/heat/CaseSummaryComponents/SingleCaseForm.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { replacer } from '#app/utils/data-parser.ts'
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import { createCase } from '#app/utils/db/case.server.ts'
import {
	fileUploadHandler,
	uploadHandler,
} from '#app/utils/file-upload-handler.ts'
import { type RulesEngineActionData, useRulesEngine } from '#app/utils/hooks/use-rules-engine.ts'
import {
	executeGetAnalyticsFromFormJs,
	executeParseGasBillPy,
} from '#app/utils/rules-engine.ts'
import {
	invariant,
} from '#node_modules/@epic-web/invariant/dist'
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import { type NaturalGasUsageDataSchema } from '#types/index.ts'
import { Schema, /* type SchemaZodFromFormType */ } from '#types/single-form.ts'
import { type Route } from './+types/$caseId.edit'

// const percentToDecimal = (value: number, errorMessage: string) => {
// 	const decimal = parseFloat((value / 100).toFixed(2))
// 	console.log('decimal ', { value, decimal })
// 	if (isNaN(decimal) || decimal > 1) {
// 		throw new Error(errorMessage)
// 	}

// 	return decimal
// }

// const generateRulesEngineData = async (
// 	formInputs: SchemaZodFromFormType,
// 	uploadedTextFile: string,
// ) => {
// 	// TODO: WI: in single.tsx a call to a PyProxy is made that duplicates this logic and calls proxy.destroy.
// 	// 			 Check if I need to do the same thing
// 	const pyodideResultsFromTextFile: NaturalGasUsageDataSchema =
// 		executeParseGasBillPy(uploadedTextFile).toJs()

// 	const { state_id, county_id, convertedDatesTIWD } =
// 		await getConvertedDatesTIWD(
// 			pyodideResultsFromTextFile,
// 			formInputs.street_address,
// 			formInputs.town,
// 			formInputs.state,
// 		)

// 	console.log('getConvertedDatesTIWD outputs>', {
// 		state_id,
// 		county_id,
// 		convertedDatesTIWD,
// 	})

// 	invariant(state_id, 'StateID not found')
// 	invariant(county_id, 'county_id not found')
// 	invariant(convertedDatesTIWD.dates.length, 'Missing dates')
// 	invariant(convertedDatesTIWD.temperatures.length, 'Missing temperatures')

// 	// Call to the rules-engine with raw text file
// 	console.log('executeGetAnalyticsFromFormJs inputs>', {
// 		formInputs,
// 		convertedDatesTIWD,
// 		uploadedTextFile,
// 		state_id,
// 		county_id,
// 	})
// 	const gasBillDataFromTextFilePyProxy: PyProxy = executeGetAnalyticsFromFormJs(
// 		formInputs,
// 		convertedDatesTIWD,
// 		uploadedTextFile,
// 		state_id,
// 		county_id,
// 	)
// 	const gasBillDataFromTextFile = gasBillDataFromTextFilePyProxy.toJs()
// 	gasBillDataFromTextFilePyProxy.destroy()

// 	// Call to the rules-engine with adjusted data (see checkbox implementation in recalculateFromBillingRecordsChange)
// 	// const calculatedData: any = executeRoundtripAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, gasBillDataFromTextFile, state_id, county_id).toJs()

// 	const str_version = JSON.stringify(gasBillDataFromTextFile, replacer)

// 	return {
// 		data: str_version,
// 		parsedAndValidatedFormSchema: formInputs,
// 		convertedDatesTIWD,
// 		state_id,
// 		county_id,
// 	}
// }

// export async function loader({ request }: Route.LoaderArgs) {
//     let url = new URL(request.url)
//     let isDevMode: boolean = url.searchParams.get('dev')?.toLowerCase() === 'true'
//     return { isDevMode }
// }

// TODO: Implement updating a case
export async function action({ request, params: _params }: Route.ActionArgs) {
	// TODO: Keep making this call, is there a better way to authenticate routes?
	const userId = await requireUserId(request)

	// Checks if url has a homeId parameter, throws 400 if not there
	// invariantResponse(params.homeId, 'homeId param is required')
	const formData = await parseMultipartFormData(request, uploadHandler)
	const submission = parseWithZod(formData, {
		schema: Schema,
	})

	if (submission.status !== 'success') {
		if (process.env.NODE_ENV === 'development') {
			// this can have personal identifying information, so only active in development.
			console.error('submission failed', submission)
		}
		return { 
			submitResult: submission.reply(),
			parsedAndValidatedFormSchema: undefined,
			data: undefined,
			convertedDatesTIWD: undefined,
			state_id: undefined,
			county_id: undefined,
			caseInfo: undefined,
		}
	}

	const parsedAndValidatedFormSchema = Schema.parse({
		name: `${submission.value.name}'s home`,
		living_area: submission.value.living_area,
		street_address: submission.value.street_address,
		town: submission.value.town,
		state: submission.value.state,
		fuel_type: submission.value.fuel_type,
		heating_system_efficiency: submission.value.heating_system_efficiency,
		thermostat_set_point: submission.value.thermostat_set_point,
		setback_temperature: submission.value.setback_temperature,
		setback_hours_per_day: submission.value.setback_hours_per_day,
		design_temperature_override: submission.value.design_temperature_override,
		energy_use_upload: submission.value.energy_use_upload,
		// design_temperature: 12 /* TODO:  see #162 and esp. #123*/
	})

	try {
		const uploadedTextFile: string = await fileUploadHandler(formData)
		// This assignment of the same name is a special thing. We don't remember the name right now.
		// It's not necessary, but it is possible.
		// TODO: WI: Why do we call executeParseGasBillPy twice? Firs ttime creates a proxy, second time we actually call the func.
		const pyodideResultsFromTextFilePyProxy: PyProxy =
			executeParseGasBillPy(uploadedTextFile)
		const pyodideResultsFromTextFile: NaturalGasUsageDataSchema =
			executeParseGasBillPy(uploadedTextFile).toJs()
		pyodideResultsFromTextFilePyProxy.destroy()

		/**
		 * This function takes a CSV string and an address
		 * and returns date and weather data,
		 * and geolocation information
		 */
		// Define variables at function scope for access in the return statement
		let caseRecord: { id: number } | undefined
		let analysis: { id: number } | undefined
		let heatingInput: { id: number } | undefined
		
		const result = await getConvertedDatesTIWD(
			pyodideResultsFromTextFile,
			submission.value.street_address,
			submission.value.town,
			submission.value.state,
		)

		const convertedDatesTIWD = result.convertedDatesTIWD
		const state_id = result.state_id
		const county_id = result.county_id

        invariant(userId, 'userId not found in request')

		// Call to the rules-engine with raw text file
		const gasBillDataFromTextFilePyProxy: PyProxy =
			executeGetAnalyticsFromFormJs(
				parsedAndValidatedFormSchema,
				convertedDatesTIWD,
				uploadedTextFile,
				state_id,
				county_id,
			)
		const gasBillDataFromTextFile = gasBillDataFromTextFilePyProxy.toJs()
		gasBillDataFromTextFilePyProxy.destroy()
		await createCase(submission.value, result, userId)
		

		// Call to the rules-engine with adjusted data (see checkbox implementation in recalculateFromBillingRecordsChange)
		// const calculatedData: any = executeRoundtripAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, gasBillDataFromTextFile, state_id, county_id).toJs()

		return {
			submitResult: submission.reply(),
			data: JSON.stringify(gasBillDataFromTextFile, replacer),
			parsedAndValidatedFormSchema,
			convertedDatesTIWD,
			state_id,
			county_id,
			// Return case information for linking to case details
			caseInfo: {
				caseId: caseRecord?.id,
				analysisId: analysis?.id,
				heatingInputId: heatingInput?.id,
			},
		}
	} catch (error: unknown) {
		console.error('Calculate failed')
		if (error instanceof Error) {
			console.error(error.message)
			const errorLines = error.message.split('\n').filter(Boolean)
			const lastLine = errorLines[errorLines.length - 1] || error.message
			return data(
				// see comment for first submission.reply for additional options
				{
					submitResult: submission.reply({
						formErrors: [lastLine],
					}),
					parsedAndValidatedFormSchema: undefined,
					data: undefined,
					convertedDatesTIWD: undefined,
					state_id: undefined,
					county_id: undefined,
					caseInfo: undefined,
				},
				{ status: 500 },
			)
		} else {
			return data(
				// see comment for first submission.reply for additional options
				{
					submitResult: submission.reply({
						formErrors: ['Unknown Error'],
					}),
					parsedAndValidatedFormSchema: undefined,
					data: undefined,
					convertedDatesTIWD: undefined,
					state_id: undefined,
					county_id: undefined,
					caseInfo: undefined,
				},
				{ status: 500 },
			)
		}
	}
}

export default function CreateCase({
	loaderData,
	actionData,
}: Route.ComponentProps) {
		const {
			lazyLoadRulesEngine,
			usageData,
			toggleBillingPeriod,
		} = useRulesEngine(actionData as RulesEngineActionData)
	
		// ✅ Extract structured values from actionData
	
		
		// type SchemaZodFromFormType = z.infer<typeof Schema>
		// type MinimalFormData = { fuel_type: 'GAS' }
	
		// const defaultValue: SchemaZodFromFormType | MinimalFormData | undefined =
		// 	loaderData.isDevMode
		// 		? {
		// 				living_area: 2155,
		// 				street_address: '15 Dale Ave',
		// 				town: 'Gloucester',
		// 				state: 'MA',
		// 				name: 'CIC',
		// 				fuel_type: 'GAS',
		// 				heating_system_efficiency: 0.97,
		// 				thermostat_set_point: 68,
		// 				setback_temperature: 65,
		// 				setback_hours_per_day: 8,
		// 			}
		// 		: { fuel_type: 'GAS' }

	
		// ✅ Pass `result` as `lastResult`
		return (
			<SingleCaseForm
				beforeSubmit={() => lazyLoadRulesEngine()}
				lastResult={actionData?.submitResult}
				defaultFormValues={
					loaderData.rulesEngineData.parsedAndValidatedFormSchema
				}
				showSavedCaseIdMsg={!!actionData}
				caseInfo={actionData?.caseInfo}
				usageData={usageData}
				showUsageData={!!usageData}
				onClickBillingRow={toggleBillingPeriod}
				parsedAndValidatedFormSchema={actionData?.parsedAndValidatedFormSchema}
			/>
		)
	
}