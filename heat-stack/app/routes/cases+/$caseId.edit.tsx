import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import { useEffect, useState } from 'react'
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
import { type BillingRecordsSchema } from '#types/types.ts'
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

	const heatingOutput = analysis.heatingOutput?.[0]

	// Transform billing records from database format to BillingRecordsSchema format
	const billingRecords: BillingRecordsSchema = (heatingInput.processedEnergyBill || []).map(bill => ({
		period_start_date: bill.periodStartDate?.toISOString().split('T')[0] || '', // Convert to YYYY-MM-DD format
		period_end_date: bill.periodEndDate?.toISOString().split('T')[0] || '', // Convert to YYYY-MM-DD format
		usage: bill.usageQuantity,
		inclusion_override: bill.invertDefaultInclusion,
		analysis_type: bill.analysisType,
		default_inclusion: bill.defaultInclusion,
		eliminated_as_outlier: false, // Default value as it's not stored in DB yet
		whole_home_heat_loss_rate: bill.wholeHomeHeatLossRate || 0, // Handle null values
	}))


	// TODO: WI: Geocoder API is not returning the street number and therefore the rulesEngine calculation is failing
	//			 Not sure how to intrepret the data returned
	// TODO: WI: why do we need a place holder for energy_use_upload since it's required by schema but not needed for edit
	const parsedAndValidatedFormData = Schema.parse({
		// Placeholder for energy_use_upload since it's required by schema but not needed for edit
		energy_use_upload: {
			name: 'existing-energy-data.csv',
			size: 0,
			type: 'text/csv'
		},
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
		// TODO: WI: when we save designTemperatureOverride we are converting from number to boolean
		//           See if we should be using boolean on UI side.
		//           Assuming that if true designTemperatureOverride should be 1 else 0
		design_temperature_override: heatingInput.designTemperatureOverride ? 1 : 0,
		// design_temperature: 12 /* TODO:  see #162 and esp. #123*/
	})

	// Convert heating output from database format to UI format if available
	const heatLoadOutput = heatingOutput ? {
		estimated_balance_point: heatingOutput.estimatedBalancePoint,
		other_fuel_usage: heatingOutput.otherFuelUsage,
		average_indoor_temperature: heatingOutput.averageIndoorTemperature,
		difference_between_ti_and_tbp: heatingOutput.differenceBetweenTiAndTbp,
		design_temperature: heatingOutput.designTemperature,
		whole_home_heat_loss_rate: heatingOutput.wholeHomeHeatLossRate,
		standard_deviation_of_heat_loss_rate: heatingOutput.standardDeviationOfHeatLossRate,
		average_heat_load: heatingOutput.averageHeatLoad,
		maximum_heat_load: heatingOutput.maximumHeatLoad,
	} : undefined

	return {
		defaultFormValues: parsedAndValidatedFormData,
		caseInfo: {
			caseId: caseRecord.id,
			analysisId: analysis.id,
			heatingInputId: heatingInput.id,
		},
		billingRecords,
		heatLoadOutput,
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
		// Check the intent to determine which action to take
		const intent = formData.get('intent') as string

		if (intent === 'process-file') {
			// Full update with new energy file - use the original processCaseUpdate
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
		} else {
			// Simple form update (intent === 'save' or fallback) - just update the database fields
			const { updateCaseRecord } = await import('#app/utils/db/case.db.server.ts')
			const updatedCase = await updateCaseRecord(caseId, submission.value, {}, userId)

			return {
				submitResult: submission.reply(),
				data: undefined, // No new calculation data
				parsedAndValidatedFormSchema: submission.value,
				convertedDatesTIWD: undefined,
				state_id: undefined,
				county_id: undefined,
				caseInfo: {
					caseId: updatedCase?.id,
					analysisId: updatedCase?.analysis?.[0]?.id,
				},
			}
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
	
	const { usageData: rulesEngineUsageData, lazyLoadRulesEngine, recalculateFromBillingRecordsChange } =
		useRulesEngine(rulesEngineActionData)

	const parsedAndValidatedFormSchema =
		actionData?.parsedAndValidatedFormSchema ?? loaderData.defaultFormValues

	// Local state for billing records to handle checkbox toggling
	const [localBillingRecords, setLocalBillingRecords] = useState(loaderData.billingRecords)

	// Update local state when loader data changes
	useEffect(() => {
		setLocalBillingRecords(loaderData.billingRecords)
	}, [loaderData.billingRecords])

	// Initialize rules engine with proper calculation context for edit mode
	useEffect(() => {
		if (loaderData.billingRecords && loaderData.billingRecords.length > 0 && recalculateFromBillingRecordsChange) {
			
			// Ensure rules engine is loaded first
			lazyLoadRulesEngine()
			
			// Small delay to ensure rules engine is initialized
			setTimeout(() => {
				if (recalculateFromBillingRecordsChange) {
					// Create proper parsedLastResult Map structure that the rules engine expects
					const parsedLastResult = new Map<string, any>()
					
					// Add heat_load_output as Map
					const heatLoadOutput = new Map<string, any>()
					heatLoadOutput.set('estimated_balance_point', 1)
					heatLoadOutput.set('other_fuel_usage', 1)
					heatLoadOutput.set('average_indoor_temperature', 70)
					heatLoadOutput.set('difference_between_ti_and_tbp', 1)
					heatLoadOutput.set('design_temperature', 10)
					heatLoadOutput.set('whole_home_heat_loss_rate', 1)
					heatLoadOutput.set('standard_deviation_of_heat_loss_rate', 1)
					heatLoadOutput.set('average_heat_load', 1)
					heatLoadOutput.set('maximum_heat_load', 1)
					parsedLastResult.set('heat_load_output', heatLoadOutput)
					
					// Add balance_point_graph as Map
					const balancePointGraph = new Map<string, any>()
					balancePointGraph.set('records', [])
					parsedLastResult.set('balance_point_graph', balancePointGraph)
					
					// Add processed_energy_bills as array of Maps
					const billingMaps = loaderData.billingRecords.map(bill => {
						const billMap = new Map<string, any>()
						billMap.set('period_start_date', bill.period_start_date)
						billMap.set('period_end_date', bill.period_end_date)
						billMap.set('usage', bill.usage)
						billMap.set('inclusion_override', bill.inclusion_override)
						billMap.set('analysis_type', bill.analysis_type)
						billMap.set('default_inclusion', bill.default_inclusion)
						billMap.set('eliminated_as_outlier', bill.eliminated_as_outlier)
						billMap.set('whole_home_heat_loss_rate', bill.whole_home_heat_loss_rate)
						return billMap
					})
					parsedLastResult.set('processed_energy_bills', billingMaps)
					
					try {
						recalculateFromBillingRecordsChange(
							parsedLastResult,
							loaderData.billingRecords,
							parsedAndValidatedFormSchema,
							{}, // convertedDatesTIWD - empty for now
							undefined, // state_id
							undefined, // county_id
						)
					} catch {
						// Handle any errors during calculation
					}
				}
			}, 100)
		}
	}, [loaderData.billingRecords, recalculateFromBillingRecordsChange, parsedAndValidatedFormSchema, lazyLoadRulesEngine])

	// Use rules engine data when available (after initialization), fallback to local billing records with database heat load output
	const usageData = rulesEngineUsageData || (localBillingRecords && localBillingRecords.length > 0 ? {
		heat_load_output: loaderData.heatLoadOutput || {
			estimated_balance_point: 1,
			other_fuel_usage: 1,
			average_indoor_temperature: 70,
			difference_between_ti_and_tbp: 1,
			design_temperature: 10, // Non-zero placeholder value
			whole_home_heat_loss_rate: 1, // Non-zero placeholder value
			standard_deviation_of_heat_loss_rate: 1,
			average_heat_load: 1,
			maximum_heat_load: 1,
		},
		balance_point_graph: {
			records: [],
		},
		processed_energy_bills: localBillingRecords,
	} : undefined)

	// Custom toggle function for edit mode that doesn't require full rules engine initialization
	const editModeToggleBillingPeriod = (index: number) => {
		const updatedRecords = localBillingRecords.map((record, i) => {
			if (i === index) {
				return { ...record, inclusion_override: !record.inclusion_override }
			}
			return record
		})
		
		setLocalBillingRecords(updatedRecords)
	}

	return (
		<SingleCaseForm
			beforeSubmit={() => lazyLoadRulesEngine()}
			lastResult={actionData?.submitResult}
			defaultFormValues={loaderData.defaultFormValues}
			showSavedCaseIdMsg={!!actionData}
			caseInfo={loaderData.caseInfo}
			usageData={usageData}
			showUsageData={!!usageData}
			onClickBillingRow={editModeToggleBillingPeriod}
			parsedAndValidatedFormSchema={parsedAndValidatedFormSchema}
			isEditMode={true}
		/>
	)
}