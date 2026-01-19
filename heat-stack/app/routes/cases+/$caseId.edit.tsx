import { parseWithZod } from '@conform-to/zod'
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
import { buildCurrentUsageData } from '#app/utils/index.ts'
import { executeRoundtripAnalyticsFromFormJs } from '#app/utils/rules-engine.ts'
import { hasAdminRole } from '#app/utils/user.ts'
import { invariantResponse } from '#node_modules/@epic-web/invariant/dist'
import { Schema, SaveOnlySchema } from '#types/single-form.ts'
import { type BillingRecordsSchema } from '#types/types.ts'
import { type Route } from './+types/$caseId.edit'

export async function loader({ params, request }: Route.LoaderArgs) {
	const percentToDecimal = (value: number, errorMessage: string) => {
		const decimal = parseFloat((value / 100).toFixed(2))
		if (isNaN(decimal) || decimal > 1) {
			throw new Error(errorMessage)
		}
		return decimal
	}
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

	const parsedAndValidatedFormData = Schema.parse({
		// Placeholder for energy_use_upload since it's required by schema but not needed for edit
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

		heating_system_efficiency: percentToDecimal(
			heatingInput.heatingSystemEfficiency,
			'Invalid heating system efficiency value detected',
		),
		thermostat_set_point: heatingInput.thermostatSetPoint,
		setback_temperature: heatingInput.setbackTemperature,
		setback_hours_per_day: heatingInput.setbackHoursPerDay,
		design_temperature_override: heatingInput.designTemperatureOverride ? 1 : 0,
		// design_temperature: 12 /* TODO:  see #162 and esp. #123*/
	})

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

	// Check the intent to determine validation approach
	const intent = formData.get('intent') as string

	let submission

	if (intent === 'save') {
		// For save intent, use schema without file validation
		submission = parseWithZod(formData, { schema: SaveOnlySchema })
	} else {
		// Use full validation for process-file intent
		submission = parseWithZod(formData, { schema: Schema })
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
	console.log('🔄 Processing save operation for case:', caseId)

	// Parse billing records from form data if present
	const billingRecordsJson = formData.get('billing_records') as string | null
	let billingRecords: any[] | undefined
	if (billingRecordsJson) {
		try {
			const parsed = JSON.parse(billingRecordsJson)
			billingRecords = Array.isArray(parsed) ? parsed : undefined
			console.log('📊 Parsed billing records:', billingRecords)
		} catch (error) {
			console.error('❌ Failed to parse billing records:', error)
		}
	}

	// Parse heat load output from form data if present
	const heatLoadOutputJson = formData.get('heat_load_output') as string | null
	let heatLoadOutput: any | undefined
	if (heatLoadOutputJson) {
		try {
			heatLoadOutput = JSON.parse(heatLoadOutputJson)
			console.log('📊 Parsed heat load output:', heatLoadOutput)
		} catch (error) {
			console.error('❌ Failed to parse heat load output:', error)
		}
	}

	const updatedCase = await updateCaseRecord(
		caseId,
		submission.value,
		{},
		userId,
		billingRecords,
		heatLoadOutput,
	)
	console.log('✅ Case updated successfully:', {
		caseId: updatedCase?.id,
		analysisId: updatedCase?.analysis?.[0]?.id,
	})

	// For save operations, add a dummy energy_use_upload to match expected type
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
	console.log('📤 Returning save result:', result)
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
	const [calculatedUsageData, setCalculatedUsageData] = useState<any>(undefined)

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

	// Update local state when loader data changes
	useEffect(() => {
		setLocalBillingRecords(loaderData.billingRecords)
	}, [loaderData.billingRecords])

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

	// Custom toggle function for edit mode that calls client-side rules engine for recalculation
	const editModeToggleBillingPeriod = (index: number) => {
		console.log('🔄 Toggle billing period called for index:', index)
		const updatedRecords = localBillingRecords.map((record, i) => {
			if (i === index) {
				const newRecord = {
					...record,
					inclusion_override: !record.inclusion_override,
				}
				console.log('📝 Updated record:', {
					index: i,
					old: record.inclusion_override,
					new: newRecord.inclusion_override,
				})
				return newRecord
			}
			return record
		})

		setLocalBillingRecords(updatedRecords)

		// Trigger client-side recalculation with updated billing records
		if (
			parsedAndValidatedFormSchemaForEffects &&
			loaderData.state_id &&
			loaderData.county_id
		) {
			console.log('🚀 Triggering client-side recalculation...')
			console.log('📋 Current usageData:', usageData)
			console.log(
				'🔍 Function check:',
				typeof executeRoundtripAnalyticsFromFormJs,
				executeRoundtripAnalyticsFromFormJs,
			)

			try {
				// Check if the function is still valid (not destroyed)
				if (typeof executeRoundtripAnalyticsFromFormJs !== 'function') {
					throw new Error(
						'executeRoundtripAnalyticsFromFormJs is not available - rules engine may need to be reloaded',
					)
				}

				// Create userAdjustedData structure with updated records
				const userAdjustedData = {
					processed_energy_bills: updatedRecords,
				}

				// Call the function and immediately handle the result
				let calcResult: any
				try {
					const calcResultPyProxy = executeRoundtripAnalyticsFromFormJs(
						parsedAndValidatedFormSchemaForEffects as any,
						loaderData.convertedDatesTIWD as any,
						userAdjustedData as any,
						loaderData.state_id,
						loaderData.county_id,
					)

					// toJs() converts Python objects to JS - dicts become Maps by default
					calcResult = calcResultPyProxy.toJs()

					// Destroy immediately after conversion
					calcResultPyProxy.destroy()
				} catch (pyError) {
					console.error('❌ PyProxy error:', pyError)
					throw pyError
				}

				console.log(
					'📊 Recalculation result type:',
					calcResult instanceof Map,
					calcResult,
				)

				const newUsageData = buildCurrentUsageData(calcResult)
				setCalculatedUsageData(newUsageData)
				console.log('✅ Recalculation completed successfully', newUsageData)
			} catch (error) {
				console.error('❌ Recalculation failed:', error)
				setErrorModal({
					isOpen: true,
					title: 'Recalculation Failed',
					message: `An error occurred during recalculation: ${error instanceof Error ? error.message : 'Unknown error'}`,
				})
			}
		} else {
			console.error('❌ Cannot recalculate - missing required data:', {
				hasSchema: !!parsedAndValidatedFormSchemaForEffects,
				hasStateId: !!loaderData.state_id,
				hasCountyId: !!loaderData.county_id,
			})
			setErrorModal({
				isOpen: true,
				title: 'Recalculation Failed',
				message: `Unable to recalculate results because required data is missing.\n\nPlease refresh the page and try again.`,
			})
		}
	}

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
				onClickBillingRow={editModeToggleBillingPeriod}
				parsedAndValidatedFormSchema={
					parsedAndValidatedFormSchemaForEffects as any
				}
				isEditMode={true}
				billingRecords={localBillingRecords}
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
