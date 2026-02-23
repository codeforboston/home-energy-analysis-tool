import { parseWithZod } from '@conform-to/zod'
// import { parseFormData } from '@mjackson/form-data-parser';
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import { useEffect, useState } from 'react'

import { ErrorModal } from '#app/components/ui/ErrorModal.tsx'
import SingleCaseForm from '#app/components/ui/heat/CaseSummaryComponents/SingleCaseForm.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { updateCaseRecord } from '#app/utils/db/case.db.server.ts'
import {
	getCaseForEditing,
	getLoggedInUserFromRequest,
} from '#app/utils/db/case.server.ts'
import { uploadHandler } from '#app/utils/file-upload-handler.ts'
import GeocodeUtil from '#app/utils/GeocodeUtil.ts'
// import { buildCurrentUsageData } from '#app/utils/index.ts'
// import { processCaseUpdate } from '#app/utils/logic/case.logic.server.ts'
// import { executeRoundtripAnalyticsFromFormJs } from '#app/utils/rules-engine.ts'
import { hasAdminRole } from '#app/utils/user.ts'
import { invariantResponse } from '#node_modules/@epic-web/invariant/dist'
import { Schema, SaveOnlySchema } from '#types/single-form.ts'
import { type BillingRecordsSchema } from '#types/types.ts'
import { type Route } from './+types/$caseId.edit'

export async function loader({ params, request }: Route.LoaderArgs) {
	// percentToDecimal no longer needed for loader validation
	const userId = await requireUserId(request)
	const caseId = parseInt(params.caseId)
	const user = await getLoggedInUserFromRequest(request)
	const isAdmin = hasAdminRole(user)

	invariantResponse(!isNaN(caseId), 'Invalid case ID', { status: 400 })

	const caseRecord = await getCaseForEditing(caseId, userId, isAdmin)
	invariantResponse(caseRecord, 'Case not found', { status: 404 })

	const analysis = caseRecord.analysis?.[0]
	invariantResponse(analysis, 'Invalid analysis detected', { status: 500 })


	       const heatingInput = analysis.heatingInput?.[0]
	       invariantResponse(heatingInput, 'Invalid heating input detected', {
		       status: 500,
	       })
	       // Log efficiency from database after definition
	       console.log('[LOADER] efficiency from DB after definition:', heatingInput.heatingSystemEfficiency)

// (Normalization logic removed)


const heatingOutput = analysis.heatingOutput?.[0]

// Transform billing records from database format to BillingRecordsSchema format
const billingRecords: BillingRecordsSchema = (
	heatingInput.processedEnergyBill || []
).map((bill) => ({
	period_start_date: bill.periodStartDate?.toISOString().split('T')[0] || '', // Convert to YYYY-MM-DD format
	period_end_date: bill.periodEndDate?.toISOString().split('T')[0] || '', // Convert to YYYY-MM-DD format
	usage: bill.usageQuantity,
	inclusion_override: bill.invertDefaultInclusion,
	analysis_type: bill.analysisType,
	default_inclusion: bill.defaultInclusion,
	eliminated_as_outlier: false, // Default value as it's not stored in DB yet
	whole_home_heat_loss_rate: bill.wholeHomeHeatLossRate || 0, // Handle null values
}))


	// Calculate geographic data for rules engine recalculation
	const geocodeUtil = new GeocodeUtil()
	const combined_address = `${caseRecord.location.address}, ${caseRecord.location.city}, ${caseRecord.location.state}`
	const { state_id, county_id, coordinates } =
		await geocodeUtil.getLL(combined_address)

	// Get temperature data for the billing period date range
	// We need this for recalculation when checkboxes are toggled
	let convertedDatesTIWD = {
		dates: [] as string[],
		temperatures: [] as number[],
	}

	if (
		heatingInput.processedEnergyBill &&
		heatingInput.processedEnergyBill.length > 0
	) {
		// Find the earliest and latest dates from billing records
		const dates = heatingInput.processedEnergyBill
			.map((bill) => [bill.periodStartDate, bill.periodEndDate])
			.flat()
			.filter((date): date is Date => date !== null && date !== undefined)

		if (dates.length > 0) {
			const startDate = new Date(Math.min(...dates.map((d) => d.getTime())))
			const endDate = new Date(Math.max(...dates.map((d) => d.getTime())))

			// Fetch weather data for the billing period
			const { x, y } = coordinates ?? { x: 0, y: 0 }
			if (x !== 0 && y !== 0) {
				const WeatherUtil = (await import('#app/utils/WeatherUtil.ts')).default
				const weatherUtil = new WeatherUtil()

				const formatDateString = (date: Date): string => {
					return (
						date.toISOString().split('T')[0] || date.toISOString().slice(0, 10)
					)
				}

				const weatherData = await weatherUtil.getThatWeathaData(
					x,
					y,
					formatDateString(startDate),
					formatDateString(endDate),
				)

				if (weatherData) {
					const datesFromTIWD = weatherData.dates
						.map(
							(datestring) => new Date(datestring).toISOString().split('T')[0],
						)
						.filter((date): date is string => date !== undefined)
					convertedDatesTIWD = {
						dates: datesFromTIWD,
						temperatures: weatherData.temperatures.filter(
							(temp): temp is number => temp !== null,
						),
					}
				}
			}
		}
	}



	       const schemaValues = {
		       energy_use_upload: {
			       name: 'existing-energy-data.csv',
			       size: 0,
			       type: 'text/csv',
		       },
		       name: `${caseRecord.homeOwner.firstName1} ${caseRecord.homeOwner.lastName1}`,
		       living_area: caseRecord.location.livingAreaSquareFeet,
		       street_address: caseRecord.location.address,
		       town: caseRecord.location.city,
		       state: caseRecord.location.state,
		       fuel_type: heatingInput.fuelType,
			   heating_system_efficiency: heatingInput.heatingSystemEfficiency,
		       thermostat_set_point: heatingInput.thermostatSetPoint,
		       setback_temperature: heatingInput.setbackTemperature,
		       setback_hours_per_day: heatingInput.setbackHoursPerDay,
		       design_temperature_override: heatingInput.designTemperatureOverride ? 1 : 0,
		       // design_temperature: 12 /* TODO:  see #162 and esp. #123*/
	       };
	       // Log efficiency in schemaValues before validation
	       console.log('[LOADER] efficiency in schemaValues before validation:', schemaValues.heating_system_efficiency)
	       const parsedAndValidatedFormData = Schema.parse(schemaValues);
	       // Log efficiency after validation
	       console.log('[LOADER] efficiency after validation:', parsedAndValidatedFormData.heating_system_efficiency)


	// Convert heating output from database format to UI format if available
	const heatLoadOutput = heatingOutput
		? {
				estimated_balance_point: heatingOutput.estimatedBalancePoint,
				other_fuel_usage: heatingOutput.otherFuelUsage,
				average_indoor_temperature: heatingOutput.averageIndoorTemperature,
				difference_between_ti_and_tbp: heatingOutput.differenceBetweenTiAndTbp,
				design_temperature: heatingOutput.designTemperature,
				whole_home_heat_loss_rate: heatingOutput.wholeHomeHeatLossRate,
				standard_deviation_of_heat_loss_rate:
					heatingOutput.standardDeviationOfHeatLossRate,
				average_heat_load: heatingOutput.averageHeatLoad,
				maximum_heat_load: heatingOutput.maximumHeatLoad,
			}
		: undefined

	return {
		defaultFormValues: parsedAndValidatedFormData,
		efficiency_display: heatingInput.heatingSystemEfficiency != null ? Math.round(heatingInput.heatingSystemEfficiency * 100) : undefined,
		caseInfo: {
			caseId: caseRecord.id,
			analysisId: analysis.id,
			heatingInputId: heatingInput.id,
		},
		billingRecords,
		heatLoadOutput,
		state_id,
		county_id,
		convertedDatesTIWD,
	}
}

export async function action({ request, params }: Route.ActionArgs) {

	       const userId = await requireUserId(request)
	       const caseId = parseInt(params.caseId)

	       invariantResponse(!isNaN(caseId), 'Invalid case ID', { status: 400 })

	       // Parse form data based on content type
	       // useFetcher sends regular form data, file uploads send multipart
	       const contentType = request.headers.get('content-type') || ''
	       const formData = contentType.includes('multipart/form-data')
		       ? await parseMultipartFormData(request, uploadHandler)
		       : await request.formData()

	       // Log efficiency in form at beginning of action
	       let efficiencyInForm = formData.get('heating_system_efficiency')
	       console.log('[ACTION] efficiency in form at start:', efficiencyInForm)

	       // Fetch from DB for comparison
	       let dbEfficiency: number | undefined = undefined
	       try {
		       const user = await getLoggedInUserFromRequest(request)
		       const isAdmin = hasAdminRole(user)
		       const caseRecord = await getCaseForEditing(caseId, userId, isAdmin)
		       const analysis = caseRecord.analysis?.[0]
		       const heatingInput = analysis?.heatingInput?.[0]
		       dbEfficiency = heatingInput?.heatingSystemEfficiency
	       } catch (e) {
		       dbEfficiency = undefined
	       }
	       console.log('[ACTION] efficiency from DB at start:', dbEfficiency)

	       // Check the intent to determine validation approach
	       const intent = formData.get('intent') as string

	       // Log efficiency before any modification
	       efficiencyInForm = formData.get('heating_system_efficiency')
	       console.log('[ACTION] efficiency in form before modification:', efficiencyInForm)

	       // Convert heating_system_efficiency from percent to decimal if needed
	       let efficiency = formData.get('heating_system_efficiency')
	       if (efficiency != null && !isNaN(Number(efficiency))) {
		       let effNum = Number(efficiency)
		       // Log before possible modification
		       console.log('[ACTION] efficiency before possible percent->decimal modification:', effNum)
		       if (effNum > 1) {
			       formData.set('heating_system_efficiency', effNum.toString())
			       // Log after modification
			       console.log('[ACTION] efficiency after modification (should be decimal):', formData.get('heating_system_efficiency'))
		       }
	       }

	       // Log efficiency after all possible modification
	       efficiencyInForm = formData.get('heating_system_efficiency')
	       console.log('[ACTION] efficiency in form after all modification:', efficiencyInForm)


		       let submission

		       if (intent === 'save') {
			       // For save intent, use schema without file validation
			       submission = parseWithZod(formData, { schema: SaveOnlySchema })
		       } else {
			       // Use full validation for process-file intent
			       submission = parseWithZod(formData, { schema: Schema })
		       }

		       // Log efficiency after validation
		       if (submission.status === 'success') {
			       console.log('[ACTION] efficiency after validation:', submission.value?.heating_system_efficiency)
		       }

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

	// Simple form update (intent === 'save' or fallback) - just update the database fields

	// Parse billing records from form data if present
	const billingRecordsJson = formData.get('billing_records') as string | null
	let billingRecords: any[] | undefined
	if (billingRecordsJson) {
		try {
			const parsed = JSON.parse(billingRecordsJson)
			if (!Array.isArray(parsed)) {
				throw new Error('Billing records is not an array')
			}
			billingRecords = 
			    parsed.map((bill: any) => ({
					period_start_date: bill["period_start_date"],
					period_end_date: bill["period_end_date"],
					usage: bill["usage"],
					inclusion_override: bill["inclusion_override"],
					analysis_type: bill["analysis_type"],
					default_inclusion: bill["default_inclusion"],
					eliminated_as_outlier: bill["eliminated_as_outlier"],
					whole_home_heat_loss_rate: bill["whole_home_heat_loss_rate"],
			    }))
			const checkedRows = billingRecords
				.map((bill, idx) => bill.inclusion_override ? idx : null)
				.filter(idx => idx !== null)
		} catch (error) {
		}
	}


	// Parse heat load output from form data if present
	const heatLoadOutputJson = formData.get('heat_load_output') as string | null
	let heatLoadOutput: any | undefined
	if (heatLoadOutputJson) {
		try {
			heatLoadOutput = JSON.parse(heatLoadOutputJson)
		} catch (error) {
		}
	}
	console.log('')

	const updatedCase = await updateCaseRecord(
		caseId,
		submission.value,
		{},
		userId,
		billingRecords,
		heatLoadOutput,
	)

	const formDataWithFile = {
		...submission.value,
		energy_use_upload: {
			name: 'existing-data.csv',
			size: 0,
			type: 'text/csv',
		},
	}

	const result = {
		submitResult: submission.reply(),
		data: undefined, // No new calculation data
		parsedAndValidatedFormSchema: formDataWithFile,
		convertedDatesTIWD: undefined,
		state_id: undefined,
		county_id: undefined,
		caseInfo: {
			caseId: updatedCase?.id,
			analysisId: updatedCase?.analysis?.[0]?.id,
		},
	}
	return result
}

export default function EditCase({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	// Get parsedAndValidatedFormSchema early for use in effects
	const parsedAndValidatedFormSchemaForEffects =
		actionData?.parsedAndValidatedFormSchema || loaderData.defaultFormValues

	// Local state for billing records to handle checkbox toggling
	const [localBillingRecords, setLocalBillingRecords] = useState(
		loaderData.billingRecords,
	)

	// Local state for calculated usage data
	const [calculatedUsageData] = useState<any>(undefined)

	// Track if initial calculation is complete
	const [isInitialCalculationComplete, setIsInitialCalculationComplete] =
		useState(false)

	// Error modal state
	const [errorModal, setErrorModal] = useState<{
		isOpen: boolean
		title: string
		message: string
	}>({
		isOpen: false,
		title: '',
		message: '',
	})

	// Update local state when loader or action data changes
	useEffect(() => {
			if (actionData && actionData.parsedAndValidatedFormSchema && actionData.parsedAndValidatedFormSchema.billing_records) {
			try {
				const parsed = typeof actionData.parsedAndValidatedFormSchema.billing_records === 'string'
					? JSON.parse(actionData.parsedAndValidatedFormSchema.billing_records)
					: actionData.parsedAndValidatedFormSchema.billing_records
				setLocalBillingRecords(parsed)
			} catch {
				console.log('🟡 [FRONTEND] Failed to parse actionData.billing_records, using loaderData')
				setLocalBillingRecords(loaderData.billingRecords)
			}
		} else {
			setLocalBillingRecords(loaderData.billingRecords)
		}
	}, [loaderData.billingRecords, actionData])

	// Mark initial load as complete immediately - we'll use database data
	useEffect(() => {
		console.log('� Marking initial load complete - using database data')
		setIsInitialCalculationComplete(true)
	}, [])

	// Handle errors from regular form submissions (save, process-file)
	useEffect(() => {
		if (actionData && (actionData as any).error) {
			const errorMessage = (actionData as any).error
			setErrorModal({
				isOpen: true,
				title: 'Error',
				message:
					typeof errorMessage === 'string' ? errorMessage : 'An error occurred',
			})
		}
	}, [actionData])

	// On initial load, don't show any data until calculation completes to avoid flash
	// After initial load, use calculated data or fallback
	const usageData = !isInitialCalculationComplete
		? undefined
		: calculatedUsageData ||
			(localBillingRecords && localBillingRecords.length > 0
				? {
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
					}
				: undefined)

	// Custom toggle function for edit mode that updates billing record state and triggers autosave (no recalculation)

	return (
		<>
			<SingleCaseForm
				beforeSubmit={() => {}}
				lastResult={actionData?.submitResult}
				defaultFormValues={loaderData.defaultFormValues}
				showSavedCaseIdMsg={!!actionData}
				caseInfo={actionData?.caseInfo || loaderData.caseInfo}
				usageData={usageData}
				showUsageData={!!usageData}
				onBillingRecordsChange={setLocalBillingRecords}
				parsedAndValidatedFormSchema={
					parsedAndValidatedFormSchemaForEffects as any
				}
				isEditMode={true}
				billingRecords={localBillingRecords}
				onClickBillingRow={() => {}}
			/>

			<ErrorModal
				isOpen={errorModal.isOpen}
				onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
				title={errorModal.title}
				message={errorModal.message}
			/>
		</>
	)
}
