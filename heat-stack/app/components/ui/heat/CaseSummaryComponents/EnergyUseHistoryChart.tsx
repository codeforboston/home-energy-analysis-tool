import { type z } from 'zod'
import { type UsageDataSchema, type BillingRecordsSchema, type BalancePointGraphSchema, type SummaryOutputSchema } from '#/types/types.ts'
import { type RecalculateFunction } from '#app/utils/recalculateFromBillingRecordsChange.ts'
import { Checkbox } from '../../../../components/ui/checkbox.tsx'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../../components/ui/table.tsx'

import HeatingUsage from './assets/HeatingUsage.svg'
import HelpCircle from './assets/help-circle.svg'
import NonHeatingUsage from './assets/NonHeatingUsage.svg'
import NotAllowedInCalculations from './assets/NotAllowedInCalculations.svg'

// type NaturalGasBillRecord = z.infer<typeof NaturalGasBillRecordZod>
// const naturalGasBillRecord01: NaturalGasBillRecord = {
// 	periodStartDate: new Date('12/08/2017'),
// 	periodEndDate: new Date('01/07/2018'),
// 	usageTherms: 197,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord02: NaturalGasBillRecord = {
// 	periodStartDate: new Date('01/08/2018'),
// 	periodEndDate: new Date('02/07/2018'),
// 	usageTherms: 205,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord03: NaturalGasBillRecord = {
// 	periodStartDate: new Date('02/08/2018'),
// 	periodEndDate: new Date('03/07/2018'),
// 	usageTherms: 220,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord04: NaturalGasBillRecord = {
// 	periodStartDate: new Date('03/08/2018'),
// 	periodEndDate: new Date('04/07/2018'),
// 	usageTherms: 196,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBill = [
// 	naturalGasBillRecord01,
// 	naturalGasBillRecord02,
// 	naturalGasBillRecord03,
// 	naturalGasBillRecord04,
// ]

interface EnergyUseHistoryChartProps {
    lastResult: any;
    parsedLastResult: Map<any, any> | undefined;
    usageData: UsageDataSchema
    setUsageData: React.Dispatch<React.SetStateAction<UsageDataSchema | undefined>>;
    recalculateFromBillingRecordsChange: RecalculateFunction
}

function objectToString(obj: any): any {
    // !!!! typeof obj has rules for zodObjects
    // typeof obj returns the type of the value of that zod object (boolean, object, etc)
    // JSON.stringify of a Zod object is the value of that Zod object, except for null / undefined
    if (!obj) {
        return "none";
    } else if (typeof obj !== "object") {
        return JSON.stringify(obj);
    } else if (Array.isArray(obj)) {

        return `[${obj.map(value => { return objectToString(value) }).join(", ")}]`;
    }

    const retval = `{ ${Object.entries(obj).map(([key, value]) =>
        `"${key}": ${objectToString(value)}`).join(", ")} }`;
    return retval as any;
}

export function EnergyUseHistoryChart({ lastResult, parsedLastResult, setUsageData, usageData, recalculateFromBillingRecordsChange }: EnergyUseHistoryChartProps) {


    const handleOverrideCheckboxChange = (index: number) => {
        const newRecords = structuredClone(usageData.processed_energy_bills)
        const newRecordAtIndex = newRecords[index]
        
        if (newRecordAtIndex) {
            const currentOverride = newRecordAtIndex.inclusion_override
            // Toggle 'inclusion_override'
            newRecordAtIndex.inclusion_override = !currentOverride
            
            newRecords[index] = { ...newRecordAtIndex } 
        }
        const newUsageData = ({
            heat_load_output: Object.fromEntries(parsedLastResult?.get('heat_load_output')) as SummaryOutputSchema,
            balance_point_graph: Object.fromEntries(parsedLastResult?.get('balance_point_graph')) as BalancePointGraphSchema,
            processed_energy_bills: newRecords as BillingRecordsSchema,
        });
        setUsageData(newUsageData)
        const {
            parsedAndValidatedFormSchema,
            convertedDatesTIWD,
            state_id,
            county_id } = { ...lastResult }

        recalculateFromBillingRecordsChange(
            parsedLastResult,
            newRecords,
            parsedAndValidatedFormSchema,
            convertedDatesTIWD,
            state_id,
            county_id,
            setUsageData
        )
    }

    return (
        <Table id="EnergyUseHistoryChart" className='text-center border rounded-md border-neutral-300'>
            <TableHeader>
                <TableRow className='text-xs text-muted-foreground bg-neutral-50'>
                    <TableHead className="text-center">#</TableHead>
                    <TableHead className='text-center'>
                        <div className="flex flex-row">
                            <div className='text-right'>Allowed Usage</div>
                            {/* TODO: add help text */}
                            {/* <img src={HelpCircle} alt='help text' className='pl-2'/> */}
                        </div>
                    </TableHead>
                    
                    <TableHead className='text-center'>Start Date</TableHead>
                    <TableHead className='text-center'>End Date</TableHead>
                    <TableHead className='text-center'>Days in Period</TableHead>
                    <TableHead className='text-center'>Gas Usage (therms)</TableHead>
                    <TableHead className='text-center'>Whole-home UA (BTU/h-°F)</TableHead>
                    <TableHead className='text-center'>
                        <div className="flex flex-row">
                            <div className='text-right'>Override Default</div>
                            {/* TODO: add help text */}
                            {/* <img src={HelpCircle} alt='help text' className='pl-2'/> */}
                        </div>
                    </TableHead>
                    
                </TableRow>
            </TableHeader>
            <TableBody>
                {usageData.processed_energy_bills.map((newRecordAtIndex, index) => {
                    const startDate = new Date(newRecordAtIndex.period_start_date)
                    const endDate = new Date(newRecordAtIndex.period_end_date)

                    // Calculate days in period
                    const timeInPeriod = endDate.getTime() - startDate.getTime()
                    const daysInPeriod = Math.round(timeInPeriod / (1000 * 3600 * 24))

                    // Set Analysis Type image and checkbox setting
                    const analysisType = newRecordAtIndex.analysis_type
                    let analysisType_Image = undefined
                    let overrideCheckboxDisabled = false

                    /* switch case for 1, -1, 0 */
                    switch (analysisType) {
                        case 1:
                            analysisType_Image = HeatingUsage
                            break
                        case -1:
                            analysisType_Image = NonHeatingUsage
                            break
                        case 0:
                            analysisType_Image = NotAllowedInCalculations
                            overrideCheckboxDisabled = true
                            break
                    }

                    // Adjust inclusion for user input
                    let calculatedInclusion = newRecordAtIndex.default_inclusion
                    if (newRecordAtIndex.inclusion_override) {
                        calculatedInclusion = !calculatedInclusion
                    }

                    const variant = calculatedInclusion ? 'included' : 'excluded'

                    return (
                        <TableRow key={index} variant={variant}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className='justify-items-center'>
                                <img src={analysisType_Image} alt="Analysis Type" />
                            </TableCell>
                            <TableCell>{startDate.toLocaleDateString()}</TableCell>
                            <TableCell>{endDate.toLocaleDateString()}</TableCell>
                            <TableCell>{daysInPeriod}</TableCell>
                            <TableCell>{newRecordAtIndex.usage}</TableCell>
                            <TableCell>
                                {newRecordAtIndex.whole_home_heat_loss_rate
                                    ? newRecordAtIndex.whole_home_heat_loss_rate.toFixed(0)
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={newRecordAtIndex.inclusion_override}
                                    disabled={overrideCheckboxDisabled}
                                    onClick={() => handleOverrideCheckboxChange(index)}
                                />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
