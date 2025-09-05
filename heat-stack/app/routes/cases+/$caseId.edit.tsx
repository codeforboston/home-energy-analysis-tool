import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import SingleCaseForm from '#app/components/ui/heat/CaseSummaryComponents/SingleCaseForm.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { replacer } from '#app/utils/data-parser.ts'
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import { prisma } from '#app/utils/db.server.ts'
import { uploadHandler } from '#app/utils/file-upload-handler.ts'
import { useRulesEngine } from '#app/utils/hooks/use-rules-engine.ts'
import {
	executeGetAnalyticsFromFormJs,
	executeParseGasBillPy,
} from '#app/utils/rules-engine.ts'
import { invariantResponse, invariant } from '#node_modules/@epic-web/invariant/dist'
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import { type NaturalGasUsageDataSchema } from '#types/index.ts'
import { Schema, type SchemaZodFromFormType } from '#types/single-form.ts'
import { type Route } from './+types/$caseId.edit'

const getCaseForEditing = async (caseId: number, userId: string) => {
	return await prisma.case.findUnique({
		where: {
			id: caseId,
			users: {
				some: {
					id: userId,
				},
			},
		},
		include: {
			homeOwner: true,
			location: true,
			analysis: {
				take: 1, // TODO: WI: Test that latest / correct analysis is returned
				include: {
					heatingInput: {
						take: 1, // TODO: WI: Test that latest / correct heatingInput is returned
					},
					analysisDataFile: {
						take: 1,
						include: {
							EnergyUsageFile: true,
						},
					},
				},
			},
		},
	})
}

const percentToDecimal = (value: number, errorMessage: string) => {
	const decimal = parseFloat((value / 100).toFixed(2))
	console.log('decimal ', { value, decimal })
	if (isNaN(decimal) || decimal > 1) {
		throw new Error(errorMessage)
	}

	return decimal
}

const generateRulesEngineData = async (
	formInputs: SchemaZodFromFormType,
	uploadedTextFile: string,
) => {
	// TODO: WI: in single.tsx a call to a PyProxy is made that duplicates this logic and calls proxy.destroy.
	// 			 Check if I need to do the same thing
	const pyodideResultsFromTextFile: NaturalGasUsageDataSchema =
		executeParseGasBillPy(uploadedTextFile).toJs()

	const { state_id, county_id, convertedDatesTIWD } =
		await getConvertedDatesTIWD(
			pyodideResultsFromTextFile,
			formInputs.street_address,
			formInputs.town,
			formInputs.state,
		)

		console.log('getConvertedDatesTIWD outputs>',{
		state_id, county_id, convertedDatesTIWD
	})

	invariant(state_id, "StateID not found")
	invariant(county_id, "county_id not found")
	invariant(convertedDatesTIWD.dates.length, "Missing dates")
	invariant(convertedDatesTIWD.temperatures.length, "Missing temperatures")
	
	// Call to the rules-engine with raw text file
	console.log('executeGetAnalyticsFromFormJs inputs>',{
		formInputs,
		convertedDatesTIWD,
		uploadedTextFile,
		state_id,
		county_id,
	})
	const gasBillDataFromTextFilePyProxy: PyProxy = executeGetAnalyticsFromFormJs(
		formInputs,
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
		parsedAndValidatedFormSchema: formInputs,
		convertedDatesTIWD,
		state_id,
		county_id,
	}
}

export async function loader({ request, params }: Route.LoaderArgs) {
	// TODO: Add logic to redirect if feature flag is not turned on
	// process.env.FEATUREFLAG_PRISMA_HEAT_BETA2 === "true"
	const userId = await requireUserId(request)
	const caseId = parseInt(params.caseId)

	invariantResponse(!isNaN(caseId), 'Invalid case ID', { status: 400 })

	const caseRecord = await getCaseForEditing(caseId, userId)
	invariantResponse(caseRecord, 'Case not found', { status: 404 })

	const analysis = caseRecord.analysis?.[0]
	invariantResponse(analysis, 'Invalid analysis detected', { status: 500 })

	const heatingInput = analysis.heatingInput?.[0]
	invariantResponse(heatingInput, 'Invalid heating input detected', {
		status: 500,
	})

	const uploadedTextFile = analysis.analysisDataFile[0]?.EnergyUsageFile.content
	invariantResponse(uploadedTextFile, 'Invalid energy usage data detected', {
		status: 500,
	})

	const TODO_TEMP_ENERGY_USE_UPLOAD = {
		name: 'foo.csv',
		type: 'csv',
		size: 1,
	}
	// TODO: WI: Geocoder API is not returning the street number and therefore the rulesEngine calculation is failing
	//			 Not sure how to intrepret the data returned
	const parsedAndValidatedFormData = Schema.parse({
		// TODO: WI: Should we just have separate fields for first and last name? Do we care if a person has a middle name?
		name: `${caseRecord.homeOwner.firstName1} ${caseRecord.homeOwner.lastName1}`,
		living_area: caseRecord.location.livingAreaSquareFeet,
		// TODO: WI: There is a bug where street number is not getting saved
		street_address: caseRecord.location.address,
		// TODO: WI: Find out where mismatch between city and town is coming from
		town: caseRecord.location.city,
		state: caseRecord.location.state,
		fuel_type: heatingInput.fuelType,
		// TODO: WI: when we save heatingInput we are rounding and converting the efficiency value from decimal to percent
		//           therefore we need to do the opposite conversion. See if we should be saving the raw value and format in the UI instead.
		heating_system_efficiency: percentToDecimal(
			heatingInput.heatingSystemEfficiency,
			'Invalid heating system efficiency value detected',
		),
		thermostat_set_point: heatingInput.thermostatSetPoint,
		setback_temperature: heatingInput.setbackTemperature,
		setback_hours_per_day: heatingInput.setbackHoursPerDay,
		// TODO: I am not sure if energy_use_upload is getting saved anywhere. Revisit
		energy_use_upload: TODO_TEMP_ENERGY_USE_UPLOAD,
		// TODO: WI: when we save designTemperatureOverride we are converting from number to boolean
		//           See if we should be using boolean on UI side.
		//           Assuming that if true designTemperatureOverride should be 1 else 0
		design_temperature_override: heatingInput.designTemperatureOverride ? 1 : 0,
		// design_temperature: 12 /* TODO:  see #162 and esp. #123*/
	})

	return {
		rulesEngineData: await generateRulesEngineData(parsedAndValidatedFormData, uploadedTextFile),

		// Return case information for linking to case details
		caseInfo: {
			caseId: caseRecord.id,
			analysisId: analysis.id,
			heatingInputId: heatingInput.id,
		},
	}
}

// TODO: Implement updating a case
// export async function action({ request, params }: Route.ActionArgs) {
// 	// TODO: Keep making this call, is there a better way to authenticate routes?
// 	const userId = await requireUserId(request)
// 	// Checks if url has a homeId parameter, throws 400 if not there
// 	// invariantResponse(params.homeId, 'homeId param is required')
// 	const formData = await parseMultipartFormData(request, uploadHandler)
// 	const submission = parseWithZod(formData, {
// 		schema: Schema,
// 	})

// 	if (submission.status !== 'success') {
// 		if (process.env.NODE_ENV === 'development') {
// 			// this can have personal identifying information, so only active in development.
// 			console.error('submission failed', submission)
// 		}
// 		return { submitResult: submission.reply() }
// 	}

// 	const parsedAndValidatedFormSchema = Schema.parse({
// 		name: `${name}'s home`,
// 		living_area: submission.value.living_area,
// 		street_address: submission.value.street_address,
// 		town: submission.value.town,
// 		state: submission.value.state,
// 		fuel_type: submission.value.fuel_type,
// 		heating_system_efficiency: submission.value.heating_system_efficiency,
// 		thermostat_set_point: submission.value.thermostat_set_point,
// 		setback_temperature: submission.value.setback_temperature,
// 		setback_hours_per_day: submission.value.setback_hours_per_day,
// 		design_temperature_override: submission.value.design_temperature_override,
// 		energy_use_upload: submission.value.energy_use_upload,
// 		// design_temperature: 12 /* TODO:  see #162 and esp. #123*/
// 	})

// 	return { submitResult: submission.reply(), parsedAndValidatedFormSchema }
// }

export default function EditCase({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const rulesEngineData = loaderData.rulesEngineData || actionData
	// TODO: WI: Remove all references to @ts-ignore and fix the ts errors that come up
	
	const { usageData, lazyLoadRulesEngine, toggleBillingPeriod } =
		useRulesEngine(rulesEngineData)

	console.log('usageData>',usageData)

	const parsedAndValidatedFormSchema = /*actionData?.parsedAndValidatedFormSchema ?? */loaderData.rulesEngineData.parsedAndValidatedFormSchema

	return (
		<SingleCaseForm
			beforeSubmit={() => lazyLoadRulesEngine()}
			lastResult={undefined/*actionData?.submitResult*/}
			defaultFormValues={loaderData.rulesEngineData.parsedAndValidatedFormSchema}
			// TODO: WI: Test unhappy paths and see how the UI reacts
			//           I am pretty sure that the case saved box will appear
			showSavedCaseIdMsg={!!actionData}
			caseInfo={loaderData.caseInfo}
			usageData={usageData}
			showUsageData={!!usageData}
			onClickBillingRow={toggleBillingPeriod}
			parsedAndValidatedFormSchema={parsedAndValidatedFormSchema}
		/>
	)
}
