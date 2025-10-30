import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import { data } from 'react-router'

import SingleCaseForm from '#app/components/ui/heat/CaseSummaryComponents/SingleCaseForm.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { replacer } from '#app/utils/data-parser.ts'
import { getCaseForEditing } from '#app/utils/db/case.server.ts'
import { uploadHandler } from '#app/utils/file-upload-handler.ts'
import { useRulesEngine } from '#app/utils/hooks/use-rules-engine.ts'
import { processCaseUpdate } from '#app/utils/logic/case.logic.server.ts'
import { invariantResponse } from '#node_modules/@epic-web/invariant/dist'
import { Schema } from '#types/single-form.ts'
import { type Route } from './+types/$caseId.edit'

const percentToDecimal = (value: number, errorMessage: string) => {
	const decimal = parseFloat((value / 100).toFixed(2))
	if (isNaN(decimal) || decimal > 1) {
		throw new Error(errorMessage)
	}

	return decimal
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
		// TODO: WI: Find out why name mismatch exists, e.g.  app code use city but schema uses town
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
		defaultFormValues: parsedAndValidatedFormData,
		caseInfo: {
			caseId: caseRecord.id,
			analysisId: analysis.id,
			heatingInputId: heatingInput.id,
		},
	}
}

export async function action({ request, params }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const caseId = parseInt(params.caseId)
	
	invariantResponse(!isNaN(caseId), 'Invalid case ID', { status: 400 })
	
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
		const result = await processCaseUpdate(caseId, submission, userId, formData)

		return {
			submitResult: submission.reply(),
			data: JSON.stringify(result.gasBillData, replacer),
			parsedAndValidatedFormSchema: submission.value,
			convertedDatesTIWD: result.convertedDatesTIWD,
			state_id: result.state_id,
			county_id: result.county_id,
			caseInfo: {
				caseId: result.updatedCase?.id,
				analysisId: result.updatedCase?.analysis?.[0]?.id,
			},
		}
	} catch (error: any) {
		console.error('❌ Case update failed', error)
		const message =
			error instanceof Error ? error.message : 'Unknown error during case update'
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

export default function EditCase({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	// Cast actionData to match the expected type for useRulesEngine
	const rulesEngineActionData = actionData && actionData.data && typeof actionData.data === 'string' ? actionData : undefined
	
	const { usageData, lazyLoadRulesEngine, toggleBillingPeriod } =
		useRulesEngine(rulesEngineActionData)

	const parsedAndValidatedFormSchema =
		actionData?.parsedAndValidatedFormSchema ?? loaderData.defaultFormValues

	return (
		<SingleCaseForm
			beforeSubmit={() => lazyLoadRulesEngine()}
			lastResult={actionData?.submitResult}
			defaultFormValues={loaderData.defaultFormValues}
			showSavedCaseIdMsg={!!actionData}
			caseInfo={loaderData.caseInfo}
			usageData={usageData}
			showUsageData={!!usageData}
			onClickBillingRow={toggleBillingPeriod}
			parsedAndValidatedFormSchema={parsedAndValidatedFormSchema}
			isEditMode={true}
		/>
	)
}