import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import { useCallback, useEffect, useState } from 'react'
import { data, useFetcher } from 'react-router'
import { z } from 'zod'

import { ErrorModal } from '#app/components/ui/ErrorModal.tsx'
import SingleCaseForm from '#app/components/ui/heat/CaseSummaryComponents/SingleCaseForm.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { replacer } from '#app/utils/data-parser.ts'
import { getCaseForEditing } from '#app/utils/db/case.server.ts'
import { uploadHandler } from '#app/utils/file-upload-handler.ts'
import GeocodeUtil from '#app/utils/GeocodeUtil.ts'
import { useFetcherErrorHandler } from '#app/utils/hooks/use-fetcher-error-handler.ts'
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

// Schema for save operations that doesn't require file upload
const SaveOnlySchema = z.object({
	name: z.string(),
	living_area: z.number().min(500).max(10000),
	street_address: z.string(),
	town: z.string(),
	state: z.string(),
	fuel_type: z.enum(['GAS', 'OIL', 'PROPANE']),
	heating_system_efficiency: z.number().min(0.5).max(1),
	design_temperature_override: z.number().optional(),
	thermostat_set_point: z.number(),
	setback_temperature: z.number(),
	setback_hours_per_day: z.number(),
})

export async function loader({ request, params }: Route.LoaderArgs) {
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

	// Calculate geographic data for rules engine recalculation
	const geocodeUtil = new GeocodeUtil()
	const combined_address = `${caseRecord.location.address}, ${caseRecord.location.city}, ${caseRecord.location.state}`
	const { state_id, county_id, coordinates } = await geocodeUtil.getLL(combined_address)

	// Get temperature data for the billing period date range
	// We need this for recalculation when checkboxes are toggled
	let convertedDatesTIWD = {
		dates: [] as string[],
		temperatures: [] as number[],
	}

	if (heatingInput.processedEnergyBill && heatingInput.processedEnergyBill.length > 0) {
		// Find the earliest and latest dates from billing records
		const dates = heatingInput.processedEnergyBill
			.map(bill => [bill.periodStartDate, bill.periodEndDate])
			.flat()
			.filter((date): date is Date => date !== null && date !== undefined)
		
		if (dates.length > 0) {
			const startDate = new Date(Math.min(...dates.map(d => d.getTime())))
			const endDate = new Date(Math.max(...dates.map(d => d.getTime())))
			
			// Fetch weather data for the billing period
			const { x, y } = coordinates ?? { x: 0, y: 0 }
			if (x !== 0 && y !== 0) {
				const WeatherUtil = (await import('#app/utils/WeatherUtil.ts')).default
				const weatherUtil = new WeatherUtil()
				
				const formatDateString = (date: Date): string => {
					return date.toISOString().split('T')[0] || date.toISOString().slice(0, 10)
				}
				
				const weatherData = await weatherUtil.getThatWeathaData(
					x,
					y,
					formatDateString(startDate),
					formatDateString(endDate),
				)
				
				if (weatherData) {
					const datesFromTIWD = weatherData.dates
						.map((datestring) => new Date(datestring).toISOString().split('T')[0])
						.filter((date): date is string => date !== undefined)
					convertedDatesTIWD = {
						dates: datesFromTIWD,
						temperatures: weatherData.temperatures.filter((temp): temp is number => temp !== null),
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
			type: 'text/csv'
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
	
	// Handle recalculate intent for checkbox toggling
	if (intent === 'recalculate') {
		console.log('🔄 Server-side recalculation triggered for case:', caseId)
		
		try {
			// Get billing records from form data
			const billingRecordsJson = formData.get('billingRecords') as string
			const billingRecords = JSON.parse(billingRecordsJson) as BillingRecordsSchema
			
			// Get form schema data
			const formSchemaJson = formData.get('formSchema') as string
			const formSchema = JSON.parse(formSchemaJson) as any
			
			// Get temperature data
			const convertedDatesTIWDJson = formData.get('convertedDatesTIWD') as string
			const convertedDatesTIWD = JSON.parse(convertedDatesTIWDJson) as any
			
			// Get geo data
			const state_id = formData.get('state_id') as string
			const county_id = formData.get('county_id') as string
			
			console.log('📊 Recalculation input:', { 
				billingRecordsCount: billingRecords.length, 
				state_id, 
				county_id 
			})
			
			// Import and call the Python rules engine
			const { executeRoundtripAnalyticsFromFormJs } = await import('#app/utils/rules-engine.ts')
			
			// Create the userAdjustedData structure that the Python function expects
			const userAdjustedData = {
				processed_energy_bills: billingRecords
			}
			
			console.log('🧮 Calling executeRoundtripAnalyticsFromForm from server')
			const calcResultPyProxy = executeRoundtripAnalyticsFromFormJs(
				formSchema as any,
				convertedDatesTIWD as any,
				userAdjustedData as any,
				state_id,
				county_id,
			)
			const calcResult = calcResultPyProxy.toJs()
			calcResultPyProxy.destroy()
			console.log('✅ Server-side recalculation completed')
			
			return {
				submitResult: undefined,
				data: JSON.stringify(calcResult, replacer),
				parsedAndValidatedFormSchema: formSchema as any,
				convertedDatesTIWD: convertedDatesTIWD,
				state_id: state_id,
				county_id: county_id,
				caseInfo: {
					caseId: caseId,
					analysisId: undefined, // We don't need to update this for recalculation
				},
			}
		} catch (error: any) {
			console.error('❌ Server-side recalculation failed', error)
			const message = error instanceof Error ? error.message : 'Unknown error during recalculation'
			return data(
				{
					submitResult: undefined,
					parsedAndValidatedFormSchema: undefined,
					data: undefined,
					convertedDatesTIWD: undefined,
					state_id: undefined,
					county_id: undefined,
					caseInfo: undefined,
					error: message,
				},
				{ status: 500 },
			)
		}
	}
	
	let submission;
	
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

	try {

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
			console.log('🔄 Processing save operation for case:', caseId)
			const { updateCaseRecord } = await import('#app/utils/db/case.db.server.ts')
			const updatedCase = await updateCaseRecord(caseId, submission.value, {}, userId)
			console.log('✅ Case updated successfully:', { caseId: updatedCase?.id, analysisId: updatedCase?.analysis?.[0]?.id })

			// For save operations, add a dummy energy_use_upload to match expected type
			const formDataWithFile = {
				...submission.value,
				energy_use_upload: {
					name: 'existing-data.csv',
					size: 0,
					type: 'text/csv'
				}
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
				error: message, // Add error field for consistent error handling
			},
			{ status: 500 },
		)
	}
}

export default function EditCase({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	// Use separate fetcher specifically for recalculation (not form submission)
	const recalculateFetcher = useFetcher()
	
	// Cast actionData to match the expected type for useRulesEngine
	// Only pass actionData if it has calculation data (from recalculate or process-file intents)
	// Don't pass it for save operations which have data: undefined
	const rulesEngineActionData = actionData && actionData.data && typeof actionData.data === 'string' ? actionData : undefined
	
	const { usageData: rulesEngineUsageData, lazyLoadRulesEngine, recalculateFromBillingRecordsChange } =
		useRulesEngine(rulesEngineActionData as any)

	// Get parsedAndValidatedFormSchema early for use in effects
	const parsedAndValidatedFormSchemaForEffects = actionData?.parsedAndValidatedFormSchema || loaderData.defaultFormValues

	// Local state for billing records to handle checkbox toggling
	const [localBillingRecords, setLocalBillingRecords] = useState(loaderData.billingRecords)
	
	// Error modal state
	const [errorModal, setErrorModal] = useState<{
		isOpen: boolean
		title: string
		message: string
	}>({
		isOpen: false,
		title: '',
		message: ''
	})

	// Update local state when loader data changes
	useEffect(() => {
		setLocalBillingRecords(loaderData.billingRecords)
	}, [loaderData.billingRecords])

	// Initialize rules engine immediately for edit mode
	useEffect(() => {
		console.log('🔧 Rules engine initialization effect triggered')
		console.log('📊 Loading rules engine for edit mode...')
		lazyLoadRulesEngine()
	}, [lazyLoadRulesEngine])

	// Initialize rules engine with proper calculation context for edit mode
	useEffect(() => {
		console.log('🔧 Rules engine calculation setup effect triggered', {
			hasBillingRecords: !!(loaderData.billingRecords && loaderData.billingRecords.length > 0),
			hasRecalculateFunction: !!recalculateFromBillingRecordsChange,
			billingRecordsCount: loaderData.billingRecords?.length || 0
		})
		
		if (loaderData.billingRecords && loaderData.billingRecords.length > 0 && recalculateFromBillingRecordsChange) {
			console.log('✅ Conditions met, setting up initial calculation...')
			
			// Small delay to ensure rules engine is initialized
			setTimeout(() => {
				console.log('⏰ Timeout triggered, checking recalculate function:', !!recalculateFromBillingRecordsChange)
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
							parsedAndValidatedFormSchemaForEffects,
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
	}, [loaderData.billingRecords, recalculateFromBillingRecordsChange, parsedAndValidatedFormSchemaForEffects, lazyLoadRulesEngine])

	// Handle fetcher errors for recalculation only (not form saves)
	const handleFetcherError = useCallback((errorMessage: string) => {
		setErrorModal({
			isOpen: true,
			title: 'Server Error',
			message: errorMessage
		})
		// Revert optimistic update on error
		setLocalBillingRecords(loaderData.billingRecords)
	}, [loaderData.billingRecords])
	
	useFetcherErrorHandler(recalculateFetcher, handleFetcherError)

	// Handle errors from regular form submissions (save, process-file)
	useEffect(() => {
		if (actionData && (actionData as any).error) {
			const errorMessage = (actionData as any).error
			setErrorModal({
				isOpen: true,
				title: 'Error',
				message: typeof errorMessage === 'string' ? errorMessage : 'An error occurred'
			})
		}
	}, [actionData])

	// Use rules engine data when available (after initialization), fallback to local billing records with database heat load output
	console.log('📊 Usage data selection:', { 
		hasRulesEngineData: !!rulesEngineUsageData,
		rulesEngineKeys: rulesEngineUsageData ? Object.keys(rulesEngineUsageData) : null,
		hasLocalBillingRecords: !!(localBillingRecords && localBillingRecords.length > 0)
	})
	
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

	// Custom toggle function for edit mode that calls server for recalculation
	const editModeToggleBillingPeriod = (index: number) => {
		console.log('🔄 Toggle billing period called for index:', index)
		const updatedRecords = localBillingRecords.map((record, i) => {
			if (i === index) {
				const newRecord = { ...record, inclusion_override: !record.inclusion_override }
				console.log('📝 Updated record:', { index: i, old: record.inclusion_override, new: newRecord.inclusion_override })
				return newRecord
			}
			return record
		})
		
		console.log('📊 Setting updated records:', updatedRecords.map(r => r.inclusion_override))
		setLocalBillingRecords(updatedRecords)
		
		// Trigger server-side recalculation with updated billing records
		if (parsedAndValidatedFormSchemaForEffects && loaderData.state_id && loaderData.county_id) {
			console.log('🚀 Submitting recalculation request to server...')
			
			// Create form data for server submission
			const formData = new FormData()
			formData.append('intent', 'recalculate')
			formData.append('billingRecords', JSON.stringify(updatedRecords))
			formData.append('formSchema', JSON.stringify(parsedAndValidatedFormSchemaForEffects))
			formData.append('convertedDatesTIWD', JSON.stringify(loaderData.convertedDatesTIWD || {}))
			formData.append('state_id', loaderData.state_id.toString())
			formData.append('county_id', loaderData.county_id.toString())
			
			// Use separate fetcher for recalculation (doesn't interfere with form saves)
			void recalculateFetcher.submit(formData, { method: 'POST' })
		} else {
			console.error('❌ Cannot recalculate - missing required data:', { 
				hasSchema: !!parsedAndValidatedFormSchemaForEffects, 
				hasStateId: !!loaderData.state_id,
				hasCountyId: !!loaderData.county_id
			})
			setErrorModal({
				isOpen: true,
				title: 'Recalculation Failed',
				message: `Unable to recalculate results because required data is missing.\n\nPlease refresh the page and try again.`
			})
		}
	}

	return (
		<>
			<SingleCaseForm
				beforeSubmit={() => lazyLoadRulesEngine()}
				lastResult={actionData?.submitResult}
				defaultFormValues={loaderData.defaultFormValues}
				showSavedCaseIdMsg={!!actionData}
				caseInfo={actionData?.caseInfo || loaderData.caseInfo}
				usageData={usageData}
				showUsageData={!!usageData}
				onClickBillingRow={editModeToggleBillingPeriod}
				parsedAndValidatedFormSchema={parsedAndValidatedFormSchemaForEffects as any}
				isEditMode={true}
			/>
			
			<ErrorModal
				isOpen={errorModal.isOpen}
				onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
				title={errorModal.title}
				message={errorModal.message}
			/>
		</>
	)
}