 /** THE BELOW PROBABLY NEEDS TO MOVE TO A ROUTE RATHER THAN A COMPONENT, including action function, */
// import { redirect } from '@remix-run/react'
import { type SubmissionResult, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, redirect, useActionData, useLocation } from 'react-router'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import { object, type z } from 'zod'
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { replacedMapToObject, replacer, reviver } from '#app/utils/data-parser.ts'
import { fileUploadHandler, uploadHandler } from '#app/utils/file-upload-handler.ts'
import GeocodeUtil from '#app/utils/GeocodeUtil.ts'
import { writeFile } from 'fs/promises';
import { format } from 'date-fns';
import { 
    executeGetAnalyticsFromFormJs, 
    executeParseGasBillPy, 
    executeRoundtripAnalyticsFromFormJs 
} from '#app/utils/rules-engine.ts'
import WeatherUtil from '#app/utils/WeatherUtil.ts'
import { type Route } from './+types/single.tsx'
function objectToString(obj: any): any {
    // !!!! typeof obj has rules for zodObjects
    // typeof obj returns the type of the value of that zod object (boolean, object, etc)
    // JSON.stringify of a Zod object is the value of that Zod object, except for null / undefined
    if (!obj) {
        return "none";
    } else if (typeof obj !== "object" ) {
        return JSON.stringify(obj); 
    } else if (Array.isArray(obj)) {        
        return `[${obj.map(value => {return objectToString(value) }).join(", ")}]`;
    }

    const retval = `{ ${Object.entries(obj).map(([key, value]) =>
        `"${key}": ${objectToString(value) }`).join(", ")} }` ;
    return retval as any;
}

// THESE ARE OLD NOTES, please someone go through and clean these up :)
// - [x] Server side error checking/handling
// - [x] ~Save to cookie and redirect to next form~ Put everything on the same page
// - [x] - Get zod and Typescript to play nice
// - [x] (We're here) Build form #2
// - [ ] Build upload form
//   - [x] https://www.epicweb.dev/workshops/professional-web-forms/file-upload/intro-to-file-upload
//   - [x] https://github.com/epicweb-dev/web-forms/tree/main/exercises/04.file-upload
//   - [x] https://github.com/epicweb-dev/web-forms/blob/2c10993e4acffe3dd9ad7b9cb0cdf89ce8d46ecf/exercises/04.file-upload/01.solution.multi-part/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L58
//   - [x] createMemoryUploadHandler
//   - [x] parseMultipartFormData
//   - [ ] avoid dealing with the server for now
//   - [ ] pass the data to the rules engine/pyodide either in the component or the action (probably the action for validation, etc.)
// - [x] import pyodide into single.tsx and run it with genny
//     - [x] Add to README: don't forget `npm run buildpy` to build rules engine into `public/pyodide-env` if you start a new codingspace or on local.
// - [x] figure out how to set field defaults with Conform to speed up trials (defaultValue prop on input doesn't work) https://conform.guide/api/react/useForm
// - [x] (To reproduce: Fill out and submit form and go back and submit form again) How do we stop the geocoder helper from concatenating everyone's past submitted addresses onto querystring in single.tsx action?
// example: [MSW] Warning: intercepted a request without a matching request handler: GET https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1+Broadway%2C+Cambridge%2C+MA+02142&format=json&benchmark=2020&address=1+Broadway%2C+Cambridge%2C+MA+02142&format=json&benchmark=2020
// - [x] Zod error at these three lines in Genny because the .optional() zod setting (see ./types/index.tsx) is getting lost somehow, refactor as much of genny away as possible: thermostat_set_point: oldSummaryInput.thermostat_set_point, setback_temperature: oldSummaryInput.setback_temperature, setback_hours_per_day: oldSummaryInput.setback_hours_per_day,
// - [skipped] Display Conform's form-wide errors, currently thrown away (if we think of a use case - 2 fields conflicting...)
// - [x] #162: Pass CSV and form data to rules engine
// - [x] #162: Read the 'overall_start_date' => '2020-10-02',  'overall_end_date' => '2022-11-03' from NaturalGasUsageData and pass to weather fetcher (move up)
// - [x] #162: Get Pydantic to accept our 3rd param userAdjustedData aka pyodideResultsFromTextFile in the 2nd python block
// - [x] #162?: Rebase once #228 is merged and incorporate helpers.get_design_temp in python rather than 12, reconsider SchemaWithDesignTemperature,  add parameters from geocoder for new variables.
// - [ ] Validate pyodide data
// - [ ] Only use csv data after any time the user uploads csv. When the user adjusts the table, use the table data instead.
// - [ ] Disable the submit button when inputs or csv file are invalid
// - [x] Use start_date and end_date from rules-engine output of CSV parsing rather than 2 year window.
// - [ ] (use data passing function API from PR#172 from rules engine) to Build table component form
// - [x] Proposition: always set form default values when run in development
// - [ ] Pass modified table back to rules engine for full cycle revalidation
// - [ ] Feature v2: How about a dropdown? census geocoder address form picker component to choose which address from several, if ambigous or bad.
// - [ ] Treat design_temperature distinctly from design_temperature_override, and design_temperature_override should be kept in state like name or address
// - [ ] Will weather service take timestamp instead of timezone date data?

// Ours
import { HomeSchema, LocationSchema, CaseSchema /* validateNaturalGasUsageData, HeatLoadAnalysisZod */ } from '../../../types/index.ts'
import { BalancePointGraphSchema, BillingRecordsSchema, SummaryOutputSchema, UsageDataSchema, type NaturalGasUsageDataSchema} from '../../../types/types.ts'
import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'
import HeatLoadAnalysis from './heatloadanalysis.tsx'
import React, { useState } from 'react'
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import { EnergyUseUpload } from '#app/components/ui/heat/CaseSummaryComponents/EnergyUseUpload.tsx'
import { EnergyUseHistoryChart } from '#app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx'

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */

const HomeFormSchema = HomeSchema.pick({ living_area: true })
    .and(LocationSchema.pick({ address: true }))
    .and(CaseSchema.pick({ name: true }))

const CurrentHeatingSystemSchema = HomeSchema.pick({
    fuel_type: true,
    heating_system_efficiency: true,
    design_temperature_override: true,
    thermostat_set_point: true,
    setback_temperature: true,
    setback_hours_per_day: true,
})

const Schema = HomeFormSchema.and(CurrentHeatingSystemSchema) /* .and(HeatLoadAnalysisZod.pick({design_temperature: true})) */

let actionCounter = 1

export async function action({ request, params }: Route.ActionArgs) {
    // Checks if url has a homeId parameter, throws 400 if not there
    // invariantResponse(params.homeId, 'homeId param is required')
    actionCounter = actionCounter + 1

    const formData = await parseMultipartFormData(request, uploadHandler)
    const uploadedTextFile: string = await fileUploadHandler(formData)

    const submission = parseWithZod(formData, {
        schema: Schema,
    })

    if (submission.status !== 'success') {
        if (process.env.NODE_ENV === 'development') {
            // this can have personal identifying information, so only active in development.
            console.error('submission failed', submission)
        }
        return submission.reply()
        // submission.reply({
        // 	// You can also pass additional error to the `reply` method
        // 	formErrors: ['Submission failed'],
        // 	fieldErrors: {
        // 		address: ['Address is invalid'],
        // 	},

        // 	// or avoid sending the the field value back to client by specifying the field names
        // 	hideFields: ['password'],
        // }),
        // {status: submission.status === "error" ? 400 : 200}
    }

    const {
        name,
        address,
        living_area,
        fuel_type,
        heating_system_efficiency,
        thermostat_set_point,
        setback_temperature,
        setback_hours_per_day,
        design_temperature_override,
    } = submission.value

    // await updateNote({ id: params.noteId, title, content })
    //code snippet from - https://github.com/epicweb-dev/web-forms/blob/2c10993e4acffe3dd9ad7b9cb0cdf89ce8d46ecf/exercises/04.file-upload/01.solution.multi-part/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L180

    // CSV entrypoint parse_gas_bill(data: str, company: NaturalGasCompany)
    // Main form entrypoint

    type SchemaZodFromFormType = z.infer<typeof Schema>

    const parsedAndValidatedFormSchema: SchemaZodFromFormType = Schema.parse({
        living_area: living_area,
        address,
        name: `${ name }'s home`,
        fuel_type,
        heating_system_efficiency,
        thermostat_set_point,
        setback_temperature,
        setback_hours_per_day,
        design_temperature_override,
        // design_temperature: 12 /* TODO:  see #162 and esp. #123*/
    })

    /** Example:
     * records: [
     *   Map(4) {
     *     'period_start_date' => '2022-10-04',
     *     'period_end_date' => '2022-11-03',
     *     'usage_therms' => 19,
     *     'inclusion_override' => undefined
     *   }
     * ],
     * 'overall_start_date' => '2020-10-02',
     * 'overall_end_date' => '2022-11-03'
     */
    // This assignment of the same name is a special thing. We don't remember the name right now.
    // It's not necessary, but it is possible.
    const pyodideResultsFromTextFile: NaturalGasUsageDataSchema = executeParseGasBillPy(uploadedTextFile).toJs()


    /** This function takes a CSV string and an address
     * and returns date and weather data,
     * and geolocation information 
    */ 
    const {convertedDatesTIWD, state_id, county_id} = await getConvertedDatesTIWD(pyodideResultsFromTextFile, address)


    /** Main form entrypoint
     */

    // Call to the rules-engine with raw text file
    const gasBillDataFromTextFile: any = executeGetAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, uploadedTextFile, state_id, county_id).toJs()

    console.log('***** Rules-engine Output from CSV upload:', gasBillDataFromTextFile)


    //TODO: adjust below on user input (click a checkbox)
    // const gasBillDataWithUserAdjustments = gasBillDataFromTextFile

    // Call to the rules-engine with adjusted data
    // const calculatedData: any = executeRoundtripAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, gasBillDataWithUserAdjustments, state_id, county_id).toJs()

    // console.log('calculatedData: ', calculatedData)
    const str_version = JSON.stringify(gasBillDataFromTextFile, replacer);

    // Consider adding to form data, 
    return {
        data: str_version,
        parsedAndValidatedFormSchema,
        convertedDatesTIWD,
        state_id,
        county_id
        };
    // return redirect(`/single`)
} //END OF action




export default function SubmitAnalysis() {
    /* @ts-ignore */
    // USAGE OF lastResult
    // console.log("lastResult (all Rules Engine data)", lastResult !== undefined ? JSON.parse(lastResult.data, reviver): undefined)

    /**
     * Example Data Returned
     * Where temp1 is a temporary variable with the main Map of Maps (or undefined if page not yet submitted).
     * 
     * 1 of 3: heat_load_output
     * console.log("Summary Output", lastResult !== undefined ? JSON.parse(lastResult.data, reviver)?.get('heat_load_output'): undefined)
     * 
     * temp1.get('heat_load_output'): Map(9) { 
        * estimated_balance_point → 61.5, 
        * other_fuel_usage → 0.2857142857142857, 
        * average_indoor_temperature → 67, 
        * difference_between_ti_and_tbp → 5.5, 
        * design_temperature → 1, 
        * whole_home_heat_loss_rate → 48001.81184312083, 
        * standard_deviation_of_heat_loss_rate → 0.08066745182677547, 
        * average_heat_load → 3048115.0520381727, 
        * maximum_heat_load → 3312125.0171753373 
     * }
     * 
     * 
     * 2 of 3: processed_energy_bills
     * console.log("EnergyUseHistoryChart table data", lastResult !== undefined ? JSON.parse(lastResult.data, reviver)?.get('processed_energy_bills'): undefined)
     *
     * temp1.get('processed_energy_bills')
     * Array(25) [ Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), Map(9), … ]
     * 
     * temp1.get('processed_energy_bills')[0]
     * Map(9) { period_start_date → "2020-10-02", period_end_date → "2020-11-04", usage → 29, analysis_type_override → null, inclusion_override → true, analysis_type → 0, default_inclusion → false, eliminated_as_outlier → false, whole_home_heat_loss_rate → null }
     * 
     * temp1.get('processed_energy_bills')[0].get('period_start_date')
     * "2020-10-02" 
     * 
     * 
     * 3 of 3: balance_point_graph
     * console.log("HeatLoad chart", lastResult !== undefined ? JSON.parse(lastResult.data, reviver)?.get('balance_point_graph')?.get('records'): undefined) 
     * 
     * temp1.get('balance_point_graph').get('records')
        Array(23) [ Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), Map(5), … ]
        temp1.get('balance_point_graph').get('records')[0]
        Map(5) { balance_point → 60, heat_loss_rate → 51056.8007761249, change_in_heat_loss_rate → 0, percent_change_in_heat_loss_rate → 0, standard_deviation → 0.17628334816871494 }
        temp1.get('balance_point_graph').get('records')[0].get('heat_loss_rate') 
     */
    /* @ts-ignore */
    const [usageData, setUsageData] = useState<UsageDataSchema | undefined>();
    const [tally, setTally] = useState(0)

    const lastResult = useActionData<typeof action>()

    let showUsageData = lastResult !== undefined;
    

    ////////////////////////
    // TODO: 
    // - use the UsageDataSchema type here?
    // - use processed_energy_bills in Checkbox behavior
    // 
    let parsedLastResult: Map<any, any>| undefined;


    // @TODO: left off here
    /** RECALCULATE WHEN BILLING RECORDS UPDATE -- maybe this can be more generic in the future */
    const recalculateFromBillingRecordsChange = async (        
        parsedLastResult: Map<any, any> | undefined,
        billingRecords: BillingRecordsSchema,
        parsedAndValidatedFormSchema: any,
        convertedDatesTIWD: any,
        state_id: any,
        county_id: any
         ) => {
        if (!parsedLastResult)
            return
        // replace original Rules Engine's billing records with new UI's billingRecords
        const parsedNextResult = buildCurrentMapOfUsageData(parsedLastResult, billingRecords)


        // wire up usageData useState hook instead of variable.
        // why are set back temp and set back hour not optional for this one?? do we need to put nulls in or something?
    
        const calcResult = executeRoundtripAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, parsedNextResult, state_id, county_id).toJs()
        const newUsageData = calcResult && buildCurrentUsageData(calcResult)
            setUsageData((prevUsageData) => {

                if (objectToString(prevUsageData) !== objectToString(newUsageData)) {
                    return newUsageData;
                }
                return prevUsageData // sets useData to

            });

    }


    /**
     * replace original Rules Engine's billing records with new UI's billingRecords
     * @param parsedLastResult 
     * @param processedEnergyBills 
     */
    const buildCurrentMapOfUsageData = (parsedLastResult: Map<any, any>, processedEnergyBills: BillingRecordsSchema) => {
        // make a copy of parsedLastResult
        const copyOfParsedLastResult: Map<any, any> | undefined = structuredClone(parsedLastResult)

        const billMap: Array<Map<string,any>> = processedEnergyBills.map(bill => {
            return new Map(Object.entries(bill))
        })

        // const processedEnergyBillsWithMaps = change records from objects to maps in processedEnergyBills using the same key values, 
        //   and order matters (maybe)

        copyOfParsedLastResult.set("processed_energy_bills", billMap)
        return copyOfParsedLastResult
    }

    /**
     * Builds the current usage data based on the parsed last result.
     * @param parsedLastResult - The parsed last result.
     * @returns The current usage data.
     */
    const buildCurrentUsageData = (parsedLastResult: Map<any, any>): UsageDataSchema => {
        const newUsageData = ({
            heat_load_output: Object.fromEntries(parsedLastResult?.get('heat_load_output'))  as SummaryOutputSchema,
            balance_point_graph: Object.fromEntries(parsedLastResult?.get('balance_point_graph'))  as BalancePointGraphSchema,
            processed_energy_bills: parsedLastResult?.get('processed_energy_bills').map((map: any) => Object.fromEntries(map)) as BillingRecordsSchema,
        }) as UsageDataSchema


        // typecasting as UsageDataSchema because the types here do not quite line up coming from parsedLastResult as Map<any, any> - might need to think about how to handle typing the results from the python output more strictly
        // Type '{ heat_load_output: { [k: string]: any; }; balance_point_graph: { [k: string]: any; }; processed_energy_bills: any; }' is not assignable to type '{ heat_load_output: { estimated_balance_point: number; other_fuel_usage: number; average_indoor_temperature: number; difference_between_ti_and_tbp: number; design_temperature: number; whole_home_heat_loss_rate: number; standard_deviation_of_heat_loss_rate: number; average_heat_load: number; maximum_heat_load: number...'.
        return newUsageData;
    }

    if (showUsageData && hasDataProperty(lastResult)) 
        {
            // Parse the JSON string from lastResult.data
            // const parsedLastResult = JSON.parse(lastResult.data, reviver) as Map<any, any>;
            parsedLastResult = JSON.parse(lastResult.data, reviver) as Map<any, any>;


            const newUsageData = parsedLastResult && buildCurrentUsageData(parsedLastResult)
            if (tally < 4) {
                setTally(tally+1)
                setUsageData( (prevUsageData) => {
                    if (objectToString(prevUsageData) != objectToString(newUsageData)) {
                        return newUsageData;
                    }
                    return prevUsageData // sets useData to

                });
            }

       }
   
    type ActionResult = 
    | SubmissionResult<string[]>
    | { data: string }
    | undefined;
  
    /** typeguard for useAction between string[] and {data: string} */
    function hasDataProperty(result: ActionResult): result is { data: string } {
        return result !== undefined && 'data' in result && typeof (result as any).data === 'string';
    }  

    type SchemaZodFromFormType = z.infer<typeof Schema>
    const [form, fields] = useForm({
        /* removed lastResult , consider re-adding https://conform.guide/api/react/useForm#options */
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: Schema })
        },
        defaultValue: {
            living_area: 2155,
            address: '15 Dale Ave Gloucester, MA  01930',
            name: 'CIC',
            fuel_type: 'GAS',
            heating_system_efficiency: 0.97,
            thermostat_set_point: 68,
            setback_temperature: 65,
            setback_hours_per_day: 8,
            // design_temperature_override: '',
        } as SchemaZodFromFormType,
        shouldValidate: 'onBlur',
    })

    // @TODO: we might need to guarantee that Data exists before rendering - currently we need to typecast an empty object in order to pass typechecking for <EnergyUsHistory />
    return (
        <>
            <Form
                id={form.id}
                method="post"
                onSubmit={form.onSubmit}
                // if there is no usage data, hit the action on this page (/single),
                // if usage data exists, hit the action to /recalculate 
                action={showUsageData ? "/recalculate" : "/single"}
                encType= {showUsageData ? "text/plain" : "multipart/form-data"}
            >
                {' '}
                {/* https://github.com/edmundhung/conform/discussions/547 instructions on how to properly set default values
            This will make it work when JavaScript is turned off as well 
            <Input {...getInputProps(props.fields.address, { type: "text" })} /> */}
                <HomeInformation fields={fields} />
                <CurrentHeatingSystem fields={fields} />
                {/* if no usage data, show the file upload functionality */}
                <EnergyUseUpload />
                
                <ErrorList id={form.errorId} errors={form.errors} />
                {showUsageData && (
                    <>
                        <EnergyUseHistory usageData={ (usageData || {}) as UsageDataSchema } setUsageData={setUsageData} lastResult={lastResult} parsedLastResult={parsedLastResult} recalculateFn={recalculateFromBillingRecordsChange} showUsageData={showUsageData} />
                        {usageData && <HeatLoadAnalysis heatLoadSummaryOutput={usageData.heat_load_output} />}

                    </>
                )}

            </Form>
        </>
    )
}
