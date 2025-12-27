import { type SubmissionResult, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useState, useRef } from 'react'
import { Form } from 'react-router'
import { EnergyUseHistoryChart } from '#app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx'
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import {
	Schema,
	SaveOnlySchema,
	type SchemaZodFromFormType,
} from '#types/single-form.ts'
import {
	type UsageDataSchema,
	type BillingRecordsSchema,
} from '#types/types.ts'
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
	lastResult: SubmissionResult<string[]> | null | undefined
	defaultFormValues: DefaultFormValues
	showSavedCaseIdMsg: boolean
	caseInfo: CaseInfo | undefined
	usageData: UsageDataSchema | undefined
	showUsageData: boolean
	/**
	 * action is the route that the form data will be sent to. If no action is provided, current route will handle the submission
	 * TODO: I don't think this field should exist but since we have /cases/new?dev=true that we want to redirect to /cases/new, this seemed nececssary for now
	 */
	action?: '/cases/new' | undefined
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
	lastResult,
	defaultFormValues,
	showSavedCaseIdMsg,
	caseInfo,
	usageData,
	showUsageData,
	action,
	parsedAndValidatedFormSchema,
	isEditMode = false,
	billingRecords,
}: SubmitAnalysisProps) {
	const [scrollAfterSubmit, setScrollAfterSubmit] = useState(false)

	const [form, fields] = useForm({
		lastResult: lastResult,
		onValidate({ formData }) {
			// Use SaveOnlySchema for save operations in edit mode, otherwise use full Schema
			const intent = formData.get('intent') as string
			const schema = isEditMode && intent === 'save' ? SaveOnlySchema : Schema
			return parseWithZod(formData, { schema })
		},
		defaultValue: defaultFormValues,
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	// Track last focused field and its value
	const lastFocusedFieldRef = useRef<{ name: string; value: any } | null>(null)
	const formRef = useRef<HTMLFormElement>(null)

	// Toast state for autosave feedback
	const [showToast, setShowToast] = useState(false)
	// Show toast for 2 seconds when autosave triggers
	const handleAutosaveToast = () => {
		setShowToast(true)
		setTimeout(() => setShowToast(false), 2000)
	}

	return (
		<>
			<Form
				ref={formRef}
				id={form.id}
				method="post"
				onSubmit={form.onSubmit}
				action={action}
				encType="multipart/form-data"
				aria-invalid={form.errors ? true : undefined}
				aria-describedby={form.errors ? form.errorId : undefined}
				onFocus={(e) => {
					if (e.target && e.target.name) {
						lastFocusedFieldRef.current = {
							name: e.target.name,
							value: e.target.value,
						}
					}
				}}
				onBlur={(e) => {
					const target = e.target
					if (
						target &&
						(target instanceof HTMLInputElement ||
							target instanceof HTMLSelectElement ||
							target instanceof HTMLTextAreaElement) &&
						target.name
					) {
						console.log(
							'[Form] onBlur triggered for:',
							target.name,
							'value:',
							target.value,
						)
						const original = lastFocusedFieldRef.current
						const valueChanged =
							original?.name === target.name && original.value !== target.value
						console.log(
							`[Form] Field blurred: ${target.name}, original value: ${original?.name === target.name ? original.value : 'unknown'}, new value: ${target.value}`,
						)
						if (isEditMode && valueChanged && formRef.current) {
							console.log('[Form] Value changed on blur, submitting form...')
							formRef.current.requestSubmit()
							handleAutosaveToast()
						}
						lastFocusedFieldRef.current = null
					}
				}}
			>
				{/* Ensure intent is always sent for autosave */}
				{isEditMode && <input type="hidden" name="intent" value="save" />}
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
				{!isEditMode && (
					<EnergyUseUpload
						setScrollAfterSubmit={setScrollAfterSubmit}
						fields={fields}
					/>
				)}
				<ErrorList id={form.errorId} errors={form.errors} />
			</Form>
			{/* Autosave Toast */}
			{showToast && (
				<div
					style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}
					className="rounded bg-green-600 px-4 py-2 text-white shadow"
				>
					Changes saved!
				</div>
			)}
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
