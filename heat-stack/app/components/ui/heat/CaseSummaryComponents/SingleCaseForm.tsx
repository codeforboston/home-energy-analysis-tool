import { type SubmissionResult, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useState } from 'react'
import { Form } from 'react-router'
import { EnergyUseHistoryChart } from '#app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx'
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { Schema, type SchemaZodFromFormType } from '#types/single-form.ts'
import { type UsageDataSchema, type BillingRecordsSchema } from '#types/types.ts'
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { CurrentHeatingSystem } from './CurrentHeatingSystem.tsx'
import { EnergyUseUpload } from './EnergyUseUpload.tsx'
import { HeatLoadAnalysis } from './HeatLoadAnalysis.tsx'
import { HomeInformation } from './HomeInformation.tsx'

/* consolidate into FEATUREFLAG_PRISMA_HEAT_BETA2 when extracted into sep. file, export it */
export interface CaseInfo {
	caseId?: number
	analysisId?: number
	heatingInputId?: number
}
type MinimalFormData = { fuel_type: 'GAS' }
type DefaultFormValues = SchemaZodFromFormType | MinimalFormData

export type SubmitAnalysisProps = {
	/**
	 * Callback to fire before submit is executed
	 */
	beforeSubmit: () => void
	lastResult: SubmissionResult<string[]> | null | undefined
	defaultFormValues: DefaultFormValues
	showSavedCaseIdMsg: boolean
	caseInfo: CaseInfo | undefined
	usageData: UsageDataSchema | undefined
	showUsageData: boolean
	onClickBillingRow: (index: number) => void
	/**
	 * action is the route that the form data will be sent to. If no action is provided, current route will handle the submission
	 * TODO: I don't think this field should exist but since we have /cases/new?dev=true that we want to redirect to /cases/new, this seemed nececssary for now
	 */
	action?: "/cases/new" | undefined
	parsedAndValidatedFormSchema: SchemaZodFromFormType | undefined
	/**
	 * Whether this form is in edit mode (shows Save button instead of Calculate button)
	 */
	isEditMode?: boolean
	/**
	 * Billing records to save when form is submitted (edit mode only)
	 */
	billingRecords?: BillingRecordsSchema
	// actionData: (RulesEngineActionData & {
	// 	/**
	// 	 * Results returned from `parseWithZod` in the action function
	// 	 */
	// 	submitResults: SubmissionResult<string[]>
	// 	caseInfo?: CaseInfo,
	// } )| undefined
}

export default function SingleCaseForm({
	beforeSubmit,
	lastResult,
	defaultFormValues,
	showSavedCaseIdMsg,
	caseInfo,
	usageData,
	showUsageData,
	action,
	onClickBillingRow,
	parsedAndValidatedFormSchema,
	isEditMode = false,
	billingRecords,
}: SubmitAnalysisProps) {
	const [scrollAfterSubmit, setScrollAfterSubmit] = useState(false)
	// const [savedCase, setSavedCase] = useState<CaseInfo | undefined>()
	// const {
	// 	lazyLoadRulesEngine,
	// 	recalculateFromBillingRecordsChange,
	// 	usageData,
	// 	toggleBillingPeriod,
	// } = useRulesEngine(actionData)

	// // ✅ Extract structured values from actionData
	// const caseInfo = actionData?.caseInfo

	// React.useEffect(() => {
	// 	if (caseInfo) {
	// 		setSavedCase(caseInfo)
	// 	}
	// }, [caseInfo])

	// const showUsageData = actionData !== undefined

	// type SchemaZodFromFormType = z.infer<typeof Schema>
	// type MinimalFormData = { fuel_type: 'GAS' }

	// const defaultValue: SchemaZodFromFormType | MinimalFormData | undefined =
	// 	isDevMode
	// 		? {
	// 			living_area: 2155,
	// 			street_address: '15 Dale Ave',
	// 			town: 'Gloucester',
	// 			state: 'MA',
	// 			name: 'CIC',
	// 			fuel_type: 'GAS',
	// 			heating_system_efficiency: 0.97,
	// 			thermostat_set_point: 68,
	// 			setback_temperature: 65,
	// 			setback_hours_per_day: 8,
	// 		}
	// 		: { fuel_type: 'GAS' }

	// ✅ Pass `result` as `lastResult`

	const [form, fields] = useForm({
		lastResult: lastResult,
		onValidate({ formData }) {
			console.log('🔍 Form validation triggered', { 
				isEditMode, 
				intent: formData.get('intent'),
				hasFile: !!formData.get('energy_use_upload'),
				fileValue: formData.get('energy_use_upload')
			})
			// In edit mode with save intent, add dummy file to satisfy client-side validation
			if (isEditMode) {
				const intent = formData.get('intent') as string
				const fileValue = formData.get('energy_use_upload')
				const isEmpty = !fileValue || (fileValue instanceof File && fileValue.size === 0)
				console.log('🎯 Edit mode check:', { 
					intent, 
					fileValue: fileValue instanceof File ? { name: fileValue.name, size: fileValue.size, type: fileValue.type } : fileValue, 
					isEmpty, 
					condition: intent === 'save' && isEmpty 
				})
				if (intent === 'save') {
					console.log('📝 Adding dummy file for save validation')
					// Create a new FormData with all existing data plus a dummy file
					const newFormData = new FormData()
					for (const [key, value] of formData.entries()) {
						newFormData.append(key, value)
					}
					// Add dummy file to satisfy Schema requirements
					const dummyFile = new File([''], 'dummy.csv', { type: 'text/csv' })
					newFormData.set('energy_use_upload', dummyFile)
					const result = parseWithZod(newFormData, { schema: Schema })
					console.log('✅ Dummy validation result:', result.status)
					return result
				}
			}
			
			// Use normal validation for all other cases
			const result = parseWithZod(formData, { schema: Schema })
			console.log('✅ Normal validation result:', result.status)
			return result
		},
		onSubmit(event, { formData }) {
			console.log('🚀 Form submitting with intent:', formData.get('intent'))
			beforeSubmit()
		},
		defaultValue: defaultFormValues,
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<>
			<Form
				id={form.id}
				method="post"
				onSubmit={form.onSubmit}
				action={action}
				encType="multipart/form-data"
				aria-invalid={form.errors ? true : undefined}
				aria-describedby={form.errors ? form.errorId : undefined}
			>
				<div>Case {caseInfo?.caseId}</div>
				{/* Include billing records as hidden input for save operations in edit mode */}
				{isEditMode && billingRecords && (
					<input 
						type="hidden" 
						name="billing_records" 
						value={JSON.stringify(billingRecords)} 
					/>
				)}
				{/* Include heat load output for save operations in edit mode */}
				{isEditMode && usageData?.heat_load_output && (
					<input 
						type="hidden" 
						name="heat_load_output" 
						value={JSON.stringify(usageData.heat_load_output)} 
					/>
				)}
				<HomeInformation fields={fields} />
				<CurrentHeatingSystem fields={fields} />
				<EnergyUseUpload setScrollAfterSubmit={setScrollAfterSubmit} fields={fields} isEditMode={isEditMode} />
				<ErrorList id={form.errorId} errors={form.errors} />

				{showUsageData && usageData && (
					<>
						<AnalysisHeader
							usageData={usageData}
							scrollAfterSubmit={scrollAfterSubmit}
							setScrollAfterSubmit={setScrollAfterSubmit}
						/>
						<EnergyUseHistoryChart
							usageData={usageData}
							onClick={onClickBillingRow}
						/>

						{usageData &&
						usageData.heat_load_output &&
						usageData.heat_load_output.design_temperature &&
						usageData.heat_load_output.whole_home_heat_loss_rate &&
						!!parsedAndValidatedFormSchema ? (
							<HeatLoadAnalysis
								heatLoadSummaryOutput={usageData.heat_load_output}
								livingArea={parsedAndValidatedFormSchema.living_area}
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
			{showSavedCaseIdMsg &&
				caseInfo &&
				typeof caseInfo.caseId === 'number' && (
					<div className="mt-8 rounded-lg border-2 border-green-400 bg-green-50 p-4">
						<h2 className="mb-2 text-xl font-bold text-green-700">
							Case Saved Successfully!
						</h2>
						<p className="mb-4">
							Your case data has been saved to the database.
						</p>
						<p>
							<a
								href={`/cases/${caseInfo.caseId}`}
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
