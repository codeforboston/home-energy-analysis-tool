import { useForm /*, type SubmissionResult  */ } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import React, { useState, useEffect } from 'react'
import { Form } from 'react-router'
import { type z } from 'zod'

import { useRulesEngine /*, type RulesEngineActionData */} from '#app/utils/hooks/use-rules-engine.ts'
import { hasParsedAndValidatedFormSchemaProperty } from '#app/utils/index.ts'
import { type LoaderData, type ActionData } from '#types/case-form.ts'
import { Schema } from '#types/single-form.ts'

import { AnalysisHeader } from './AnalysisHeader.tsx'
import { CurrentHeatingSystem } from './CurrentHeatingSystem.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'
import { EnergyUseUpload } from './EnergyUseUpload.tsx'
import { ErrorList } from './ErrorList.tsx'
import { HeatLoadAnalysis } from './HeatLoadAnalysis.tsx'
import { HomeInformation } from './HomeInformation.tsx'

export interface CaseInfo {
    caseId?: number
    analysisId?: number
    heatingInputId?: number
}



interface CaseFormProps {
    loaderData: LoaderData
    actionData?: ActionData
}


export function CaseForm({ loaderData, actionData }: CaseFormProps) {
    const [scrollAfterSubmit, setScrollAfterSubmit] = useState(false)
    const [savedCase, setSavedCase] = useState<CaseInfo | undefined>()


    // const rulesEngineData: RulesEngineActionData = {
    //     data: actionData?.data ?? '',
    //     parsedAndValidatedFormSchema: actionData?.parsedAndValidatedFormSchema,
    //     convertedDatesTIWD: actionData?.convertedDatesTIWD as any,
    //     state_id: actionData?.state_id,
    //     county_id: actionData?.county_id,
    // }
    const {
        lazyLoadRulesEngine,
        recalculateFromBillingRecordsChange,
        usageData,
        toggleBillingPeriod,
    } = useRulesEngine(
        actionData
            ? { ...actionData, data: actionData.data ?? '' } // ensure data is string
            : { data: '' } as any // default empty object
    )

    useEffect(() => {
        if (actionData?.caseInfo) setSavedCase(actionData.caseInfo)
    }, [actionData])

    const showUsageData = actionData !== undefined

    type SchemaZodFromFormType = z.infer<typeof Schema>
    type MinimalFormData = { fuel_type: 'GAS' }

    const defaultValue: SchemaZodFromFormType | MinimalFormData | undefined =
        loaderData.isDevMode
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

    const [form, fields] = useForm({
        lastResult: actionData?.submitResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: Schema })
        },
        onSubmit() {
            lazyLoadRulesEngine()
        },
        defaultValue,
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    })

    if (!actionData?.parsedAndValidatedFormSchema) {
        return null // TODO: return error
    }
    if (!actionData?.convertedDatesTIWD) {
        return null // TODO: return error
    }
    return (
        <>
            <Form
                id={form.id}
                method="post"
                onSubmit={form.onSubmit}
                // action="/new"
                encType="multipart/form-data"
                aria-invalid={form.errors ? true : undefined}
                aria-describedby={form.errors ? form.errorId : undefined}
            >
                <div>Case {savedCase?.caseId}</div>
                <HomeInformation fields={fields} />
                <CurrentHeatingSystem fields={fields} />
                <EnergyUseUpload setScrollAfterSubmit={setScrollAfterSubmit} fields={fields} />
                <ErrorList id={form.errorId} errors={form.errors} />

                {showUsageData && usageData && recalculateFromBillingRecordsChange && (
                    <>
                        <AnalysisHeader
                            usageData={usageData}
                            scrollAfterSubmit={scrollAfterSubmit}
                            setScrollAfterSubmit={setScrollAfterSubmit}
                        />
                        <EnergyUseHistoryChart
                            usageData={usageData}
                            onClick={(index: any) => toggleBillingPeriod(index)}
                        />

                        {usageData?.heat_load_output?.design_temperature &&
                            usageData?.heat_load_output?.whole_home_heat_loss_rate &&
                            hasParsedAndValidatedFormSchemaProperty(actionData) ? (
                            <HeatLoadAnalysis
                                heatLoadSummaryOutput={usageData.heat_load_output}
                                livingArea={actionData?.parsedAndValidatedFormSchema?.living_area}
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

            {savedCase?.caseId && (
                <div className="mt-8 rounded-lg border-2 border-green-400 bg-green-50 p-4">
                    <h2 className="mb-2 text-xl font-bold text-green-700">
                        Case Saved Successfully!
                    </h2>
                    <p className="mb-4">Your case data has been saved to the database.</p>
                    <a
                        href={`/cases/${savedCase.caseId}`}
                        className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        View Case Details
                    </a>
                </div>
            )}
        </>
    )
}
