import { buildCurrentMapOfUsageData, buildCurrentUsageData, objectToString } from '#app/utils/index.ts'
import { 
    executeRoundtripAnalyticsFromFormJs 
} from '#app/utils/rules-engine.ts'
import { type Dispatch, type SetStateAction } from '#node_modules/@types/react';
import { type UsageDataSchema, type BillingRecordsSchema } from '#types/types.ts'

export type RecalculateFunction = (
    parsedLastResult: Map<any, any> | undefined,
    billingRecords: BillingRecordsSchema,
    parsedAndValidatedFormSchema: any,
    convertedDatesTIWD: any,
    state_id: any,
    county_id: any,
    setUsageData: Dispatch<SetStateAction<UsageDataSchema | undefined>>
  ) => void;

/** RECALCULATE WHEN BILLING RECORDS UPDATE -- maybe this can be more generic in the future */
export const recalculateFromBillingRecordsChange = (        
        parsedLastResult: Map<any, any> | undefined,
        billingRecords: BillingRecordsSchema,
        parsedAndValidatedFormSchema: any,
        convertedDatesTIWD: any,
        state_id: any,
        county_id: any,
        setUsageData: React.Dispatch<React.SetStateAction<UsageDataSchema | undefined>>
         ) => {
        if (!parsedLastResult) {
            console.error("parsedResult is blank")
            return
        }
        // replace original Rules Engine's billing records with new UI's billingRecords
        const parsedNextResult = buildCurrentMapOfUsageData(parsedLastResult, billingRecords)


        // why are set back temp and set back hour not optional for this one?? do we need to put nulls in or something?
        const calcResultPyProxy = executeRoundtripAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, parsedNextResult, state_id, county_id)
        const calcResult = calcResultPyProxy.toJs()
        calcResultPyProxy.destroy()

        const newUsageData = calcResult && buildCurrentUsageData(calcResult)
            setUsageData((prevUsageData) => {
                if (objectToString(prevUsageData) !== objectToString(newUsageData)) {
                    return newUsageData;
                }
                return prevUsageData
            });
    }
