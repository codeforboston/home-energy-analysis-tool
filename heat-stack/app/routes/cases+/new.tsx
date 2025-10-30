import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import { data } from 'react-router'
import { type z } from 'zod'

import SingleCaseForm from '#app/components/ui/heat/CaseSummaryComponents/SingleCaseForm.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { replacer } from '#app/utils/data-parser.ts'
import { uploadHandler } from '#app/utils/file-upload-handler.ts'
import { type RulesEngineActionData, useRulesEngine } from '#app/utils/hooks/use-rules-engine.ts'
import { processCaseSubmission } from '#app/utils/logic/case.logic.server.ts'
import { Schema } from '#types/single-form.ts'
import { type Route } from './+types/new'

// TODO: WI: figure out if this is needed - probably
// const percentToDecimal = (value: number, errorMessage: string) => {
// 	const decimal = parseFloat((value / 100).toFixed(2))
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


// 	invariant(state_id, 'StateID not found')
// 	invariant(county_id, 'county_id not found')
// 	invariant(convertedDatesTIWD.dates.length, 'Missing dates')
// 	invariant(convertedDatesTIWD.temperatures.length, 'Missing temperatures')


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

export async function loader({ request }: Route.LoaderArgs) {
    let url = new URL(request.url)
    let isDevMode: boolean = url.searchParams.get('dev')?.toLowerCase() === 'true'
    return { isDevMode }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await parseMultipartFormData(request, uploadHandler)
	const submission = parseWithZod(formData, { schema: Schema })

	if (submission.status !== 'success') {
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

	try {
		const result = await processCaseSubmission(submission, userId, formData)

		return {
			submitResult: submission.reply(),
			data: JSON.stringify(result.gasBillData, replacer),
			parsedAndValidatedFormSchema: submission.value,
			convertedDatesTIWD: result.convertedDatesTIWD,
			state_id: result.state_id,
			county_id: result.county_id,
			caseInfo: {
				caseId: result.newCase.id,
				analysisId: result.newCase.analysis.id,
			},
		}
	} catch (error: any) {
		console.error('❌ Case creation failed', error)
		const message =
			error instanceof Error ? error.message : 'Unknown error during case creation'
		return data(
			{
				submitResult: submission.reply({ formErrors: [message] }),
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

export default function CreateCase({
	loaderData,
	actionData,
}: Route.ComponentProps) {
		type SchemaZodFromFormType = z.infer<typeof Schema>
		type MinimalFormData = { fuel_type: 'GAS' }
	
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
	const defaultValue: SchemaZodFromFormType | MinimalFormData =
		loaderData?.isDevMode
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
		return (
			<SingleCaseForm
				beforeSubmit={() => lazyLoadRulesEngine()}
				lastResult={actionData?.submitResult}
				defaultFormValues={ defaultValue }
				showSavedCaseIdMsg={!!actionData}
				caseInfo={actionData?.caseInfo}
				usageData={usageData}
				showUsageData={!!usageData}
				onClickBillingRow={toggleBillingPeriod}
				parsedAndValidatedFormSchema={actionData?.parsedAndValidatedFormSchema}
			/>
		)
	
}