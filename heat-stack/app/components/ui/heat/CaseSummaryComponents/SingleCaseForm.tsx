import { type SubmissionResult, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import  { useState } from 'react'
import { Form } from 'react-router'
import { EnergyUseHistoryChart } from '#app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx'
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { Schema, type SchemaZodFromFormType } from '#types/single-form.ts'
import { type UsageDataSchema } from '#types/types.ts'
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { CurrentHeatingSystem } from './CurrentHeatingSystem.tsx'
import { EnergyUseUpload } from './EnergyUseUpload.tsx'
import { HeatLoadAnalysis } from './HeatLoadAnalysis.tsx'
import { HomeInformation } from './HomeInformation.tsx'

/* consolidate into FEATUREFLAG_PRISMA_HEAT_BETA2 when extracted into sep. file, export it */
export interface CaseInfo {
	caseId?: number;
	analysisId?: number;
	heatingInputId?: number;
}
type MinimalFormData = { fuel_type: 'GAS' }
type DefaultFormValues =  SchemaZodFromFormType | MinimalFormData


export type SubmitAnalysisProps = {
	/**
	 * Callback to fire before submit is executed
	 */
	beforeSubmit: ()=>void
	lastResult: SubmissionResult<string[]> | null | undefined
	defaultFormValues: DefaultFormValues
	showSavedCaseIdMsg: boolean
	caseInfo: CaseInfo | undefined
	usageData: UsageDataSchema | undefined
	showUsageData: boolean,
	onClickBillingRow: (index: number)=>void
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
	isEditMode = false
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
			return parseWithZod(formData, { schema: Schema })
		},
		onSubmit() {
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
			{showSavedCaseIdMsg && caseInfo && typeof caseInfo.caseId === "number" && (
				<div className="mt-8 rounded-lg border-2 border-green-400 bg-green-50 p-4">
					<h2 className="mb-2 text-xl font-bold text-green-700">Case Saved Successfully!</h2>
					<p className="mb-4">Your case data has been saved to the database.</p>
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

