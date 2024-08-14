/** THE BELOW PROBABLY NEEDS TO MOVE TO A ROUTE RATHER THAN A COMPONENT, including action function, */
// import { redirect } from '@remix-run/react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json, ActionFunctionArgs } from '@remix-run/node'
import { Form, redirect, useActionData, useLocation } from '@remix-run/react'
import { z } from 'zod'
import GeocodeUtil from '#app/utils/GeocodeUtil'
import WeatherUtil from '#app/utils/WeatherUtil'
import PyodideUtil from '#app/utils/pyodide.util.js'
import * as pyodideModule from 'pyodide'

// TODO NEXT WEEK
// - [x] Server side error checking/handling
// - [x] ~Save to cookie and redirect to next form~ Put everything on the same page
// - [x] - Get zod and Typescript to play nice
// - [x] (We're here) Build form #2
// - [ ] Build upload form
//   - https://www.epicweb.dev/workshops/professional-web-forms/file-upload/intro-to-file-upload
//   - https://github.com/epicweb-dev/web-forms/tree/main/exercises/04.file-upload
//   - https://github.com/epicweb-dev/web-forms/blob/2c10993e4acffe3dd9ad7b9cb0cdf89ce8d46ecf/exercises/04.file-upload/01.solution.multi-part/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L58
//   - createMemoryUploadHandler
//   - parseMultipartFormData
//   - avoid dealing with the server for now
//   - pass the data to the rules engine/pyodide either in the component or the action (probably the action for validation, etc.)
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
// - [Waiting] Use start_date and end_date from rules-engine output of CSV parsing rather than 2 year window.
// - [ ] (use data passing function API from PR#172 from rules engine) to Build table component form
// - [ ] Proposition: always set form default values when run in development
// - [ ] Pass modified table back to rules engine for full cycle revalidation
// - [ ] Feature v2: How about a dropdown? census geocoder address form picker component to choose which address from several, if ambigous or bad.
// - [ ] Treat design_temperature distinctly from design_temperature_override, and design_temperature_override should be kept in state like name or address

// Ours
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { Home, Location, Case, NaturalGasUsageData, validateNaturalGasUsageData, HeatLoadAnalysisZod } from '../../../types/index.ts'
import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'
import HeatLoadAnalysis from './heatloadanalysis.tsx'
import { Button } from '#/app/components/ui/button.tsx'
import { createMemoryUploadHandler } from '@remix-run/server-runtime/dist/upload/memoryUploadHandler.js'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'

const nameMaxLength = 50
const addressMaxLength = 100

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */

const HomeFormSchema = Home.pick({ living_area: true })
    .and(Location.pick({ address: true }))
    .and(Case.pick({ name: true }))

const CurrentHeatingSystemSchema = Home.pick({
    fuel_type: true,
    heating_system_efficiency: true,
    design_temperature_override: true,
    thermostat_set_point: true,
    setback_temperature: true,
    setback_hours_per_day: true,
})

const Schema = HomeFormSchema.and(CurrentHeatingSystemSchema) /* .and(HeatLoadAnalysisZod.pick({design_temperature: true})) */

export async function action({ request, params }: ActionFunctionArgs) {
    // Checks if url has a homeId parameter, throws 400 if not there
    // invariantResponse(params.homeId, 'homeId param is required')

    console.log('action started')

    const uploadHandler = createMemoryUploadHandler({
        maxPartSize: 1024 * 1024 * 5, // 5 MB
    })
    const formData = await parseMultipartFormData(request, uploadHandler)

    const file = formData.get('energy_use_upload') as File // fix as File?

    async function handleFile(file: File) {
        try {
            const fileContent = await file.text()
            return fileContent
        } catch (error) {
            console.error('Error reading file:', error)
            return ''
        }
    }

    // TODO: think about the edge cases and handle the bad user input here:
    const uploadedTextFile: string = file !== null ? await handleFile(file) : ''
    
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

    // const formData = await parseMultipartFormData(
    // 	request,
    // 	createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
    // )

    console.log('loading pyodideUtil/pyodideModule/geocodeUtil/weatherUtil')

    // const pyodideUtil = PyodideUtil.getInstance();
    // const pyodideModule = await pyodideUtil.getPyodideModule();
    const geocodeUtil = new GeocodeUtil()
    const weatherUtil = new WeatherUtil()
    // console.log("loaded pyodideUtil/pyodideModule/geocodeUtil/weatherUtil");
    ////////////////////////
    const getPyodide = async () => {
        return await pyodideModule.loadPyodide({
            // This path is actually `public/pyodide-env`, but the browser knows where `public` is. Note that remix server needs `public/`
            // TODO: figure out how to determine if we're in browser or remix server and use ternary.
            indexURL: 'public/pyodide-env/',
        })
    }
    const runPythonScript = async () => {
        const pyodide: any = await getPyodide()
        return pyodide
    }
    // consider running https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/tests/test_rules_engine/test_engine.py
    const pyodide: any = await runPythonScript()
    //////////////////////

    let {coordinates, state_id, county_id}  = await geocodeUtil.getLL(address)
    let {x, y} = coordinates;

    console.log('geocoded', x, y)

    // let { parsedAndValidatedFormSchema, weatherData, BI } = await genny(x, y, '2024-01-01', '2024-01-03')

    // pyodideUtil.runit(parsedAndValidatedFormSchema,null,weatherData,JSON.stringify(BI));
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

    // console.log('parsedAndValidatedFormSchema', parsedAndValidatedFormSchema)

    await pyodide.loadPackage(
        'public/pyodide-env/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl',
    )

    /* NOTES for pydantic, typing-extensions, annotated_types: 
        pyodide should match pyodide-core somewhat. 
        typing-extensions needs specific version per https://github.com/pyodide/pyodide/issues/4234#issuecomment-1771735148
        try getting it from 
           - https://pypi.org/project/pydantic/#files
           - https://pypi.org/project/typing-extensions/
           - https://pypi.org/project/annotated-types/#files
    */
    await pyodide.loadPackage(
        'public/pyodide-env/pydantic-2.5.2-py3-none-any.whl',
    )
    await pyodide.loadPackage(
        'public/pyodide-env/typing_extensions-4.8.0-py3-none-any.whl',
    )
    await pyodide.loadPackage(
        'public/pyodide-env/annotated_types-0.5.0-py3-none-any.whl',
    )

    await pyodide.loadPackage(
        'public/pyodide-env/rules_engine-0.0.1-py3-none-any.whl',
    )

    // console.log("uploadedTextFile", uploadedTextFile)

    /**
     * Need to parse the gas bill first to determine the start and end dates of the bill
     * so that we can request the weather for those dates.
     */
    const executeParseGasBillPy = await pyodide.runPythonAsync(`
        from rules_engine import parser
        from rules_engine.pydantic_models import (
            FuelType,
            SummaryInput,
            TemperatureInput
        )
        from rules_engine import engine
    
        def executeParse(csvDataJs):
            naturalGasInputRecords = parser.parse_gas_bill(csvDataJs, parser.NaturalGasCompany.NATIONAL_GRID)
            return naturalGasInputRecords.model_dump(mode="json")
        executeParse
    `)

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
    type NaturalGasUsageData = z.infer<typeof NaturalGasUsageData>;
    const pyodideResultsFromTextFile: NaturalGasUsageData = executeParseGasBillPy(uploadedTextFile).toJs()

    console.log('result', pyodideResultsFromTextFile )//, validateNaturalGasUsageData(pyodideResultsFromTextFile))
    const startDateString = pyodideResultsFromTextFile.get('overall_start_date')
    const endDateString = pyodideResultsFromTextFile.get('overall_end_date')

    // Do we need this?:
    // const startDateString = pyodideResultsFromTextFile.overall_start_date

    if (typeof startDateString !== 'string' || typeof endDateString !== 'string') {
        throw new Error('Start date or end date is missing or invalid');
      }
      
    const start_date = new Date(startDateString)
    const end_date = new Date(endDateString)
    
    // // Get today's date
    // const today = new Date()

    // // Calculate the date 2 years ago from today
    // const twoYearsAgo = new Date(today)
    // twoYearsAgo.setFullYear(today.getFullYear() - 2)

    // // Set the start_date and end_date
    // const start_date = twoYearsAgo
    // const end_date = today

    // const weatherData: TemperatureInput = await weatherUtil.getThatWeathaData(longitude, latitude, start_date, end_date);
    const weatherData = await weatherUtil.getThatWeathaData(
        x,
        y,
        start_date.toISOString().split('T')[0],
        end_date.toISOString().split('T')[0],
    )

    const datesFromTIWD = weatherData.dates.map(datestring => new Date(datestring).toISOString().split('T')[0])
    const convertedDatesTIWD = {dates: datesFromTIWD, temperatures: weatherData.temperatures}
    
    // console.log(`========\n========`)
    // console.log(`end`, weatherData.dates[weatherData.dates.length - 1]);
    // console.log(weatherData)
    
    // const BI = [
    // 	{
    // 		period_start_date: new Date('2023-12-30'), //new Date("2023-12-30"),
    // 		period_end_date: new Date('2024-01-06'),
    // 		usage: 100,
    // 		inclusion_override: null,
    // 	},
    // ]

    // let { parsedAndValidatedFormSchema, weatherData, BI } = await genny(x, y, '2024-01-01', '2024-01-03')

    // pyodideUtil.runit(parsedAndValidatedFormSchema,null,weatherData,JSON.stringify(BI));
    // CSV entrypoint parse_gas_bill(data: str, company: NaturalGasCompany)
    // Main form entrypoint

    const executeGetAnalyticsFromFormJs = await pyodide.runPythonAsync(`
        from rules_engine import parser
        from rules_engine.pydantic_models import (
            FuelType,
            SummaryInput,
            TemperatureInput
        )
        from rules_engine import engine, helpers

        def executeGetAnalyticsFromForm(summaryInputJs, temperatureInputJs, csvDataJs, state_id, county_id):
            """
            second step: this will be the first time to draw the table
            # two new geocode parameters may be needed for design temp:
            # watch out for helpers.get_design_temp( addressMatches[0].geographies.counties[0]['STATE'] , addressMatches[0].geographies.counties[0]['COUNTY'] county_id) 
            # in addition to latitude and longitude from GeocodeUtil.ts object .
            # pack the get_design_temp output into summary_input
            """
            
            summaryInputFromJs = summaryInputJs.as_object_map().values()._mapping
            temperatureInputFromJs =temperatureInputJs.as_object_map().values()._mapping

            # We will just pass in this data
            naturalGasInputRecords = parser.parse_gas_bill(csvDataJs, parser.NaturalGasCompany.NATIONAL_GRID)

            design_temp_looked_up = helpers.get_design_temp(state_id, county_id)
            summaryInput = SummaryInput( **summaryInputFromJs, design_temperature=design_temp_looked_up)

            temperatureInput = TemperatureInput(**temperatureInputFromJs)

            outputs = engine.get_outputs_natural_gas(summaryInput, temperatureInput, naturalGasInputRecords)

            return outputs.model_dump(mode="json")
        executeGetAnalyticsFromForm
    `)
    // type Analytics = z.infer<typeof Analytics>;
    const foo: any = executeGetAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, uploadedTextFile, state_id, county_id).toJs()

    //console.log("foo billing records [0]", foo.get('billing_records')[0] )

    const executeRoundtripAnalyticsFromFormJs = await pyodide.runPythonAsync(`
        from rules_engine import parser
        from rules_engine.pydantic_models import (
            FuelType,
            SummaryInput,
            TemperatureInput,
            NormalizedBillingPeriodRecordBase
        )
        from rules_engine import engine, helpers

        # def get_outputs_normalized(
        #	summary_input: SummaryInput,
        #	dhw_input: Optional[DhwInput],
        #	temperature_input: TemperatureInput,
        #	billing_periods: list[NormalizedBillingPeriodRecordBase],
        # )

        def executeRoundtripAnalyticsFromForm(summaryInputJs, temperatureInputJs, userAdjustedData, state_id, county_id):
            """
            "billing_records" is the "roundtripping" parameter to be passed as userAdjustedData.
            """
            
            summaryInputFromJs = summaryInputJs.as_object_map().values()._mapping
            temperatureInputFromJs =temperatureInputJs.as_object_map().values()._mapping

            design_temp_looked_up = helpers.get_design_temp(state_id, county_id)
            # expect 1 for middlesex county:  print("design temp check ",design_temp_looked_up, state_id, county_id)
            summaryInput = SummaryInput( **summaryInputFromJs, design_temperature=design_temp_looked_up)

            temperatureInput = TemperatureInput(**temperatureInputFromJs)

            # third step, re-run of the table data
            userAdjustedDataFromJsToPython = [NormalizedBillingPeriodRecordBase(**record) for record in userAdjustedData['billing_records'] ]
            # print("py", userAdjustedDataFromJsToPython[0])

            outputs2 = engine.get_outputs_normalized(summaryInput, None, temperatureInput, userAdjustedDataFromJsToPython)

            # print("py2", outputs2.billing_records[0])
            return outputs2.model_dump(mode="json")
        executeRoundtripAnalyticsFromForm
    `)

    /**
     * Ask Alan, issue with list comprehension:
Traceback (most recent call last): File "<exec>", line 32,
 in executeRoundtripAnalyticsFromForm TypeError: 
 list indices must be integers or slices, not str 
     */
    /*
    For
      'billing_records' => [
    Map(9) {
      'period_start_date' => '2020-10-02',
      'period_end_date' => '2020-11-04',
      'usage' => 29,
      'analysis_type_override' => undefined,
      'inclusion_override' => false,
      'analysis_type' => 0,
      'default_inclusion_by_calculation' => false,
      'eliminated_as_outlier' => false,
      'whole_home_heat_loss_rate' => undefined
    }, */

    const gasBillDataWithUserAdjustments = foo; /* billing_records is untested here */

    const billingRecords = foo.get('billing_records')
    billingRecords.forEach((record: any) => {
        record.set('inclusion_override', true);
    });
    // foo.set('billing_records', null)
    // foo.set('billing_records', billingRecords)
    //console.log("(after customization) gasBillDataWithUserAdjustments billing records[0]", gasBillDataWithUserAdjustments.get('billing_records')[0])
    /* why is inclusion_override still false after roundtrip */

    const foo2: any = executeRoundtripAnalyticsFromFormJs(parsedAndValidatedFormSchema, convertedDatesTIWD, gasBillDataWithUserAdjustments, state_id, county_id).toJs()

    // console.log("foo2 billing records[0]", foo2.get('billing_records')[0]);
    // console.log("foo2", foo2);
    // console.log("(after round trip) gasBillDataWithUserAdjustments billing records[0]", gasBillDataWithUserAdjustments.get('billing_records')[0])

    // const otherResult = executePy(summaryInput, convertedDatesTIWD, exampleNationalGridCSV);

    return redirect(`/single`)
}

export default function Inputs() {
    // const location = useLocation();
    // console.log(`location:`, location);  // `.state` is `null`
    const lastResult = useActionData<typeof action>()
    type SchemaZodFromFormType = z.infer<typeof Schema>
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: Schema })
        },
        defaultValue: {
            living_area: 3000,
            address: '1 Broadway, Cambridge, MA 02142',
            name: 'CIC',
            fuel_type: 'GAS',
            heating_system_efficiency: 85,
            thermostat_set_point: 68,
            setback_temperature: 65,
            setback_hours_per_day: 8,
            // design_temperature_override: '',
        } as SchemaZodFromFormType,
        shouldValidate: 'onBlur',
    })

    return (
        <>
            <Form
                id={form.id}
                method="post"
                onSubmit={form.onSubmit}
                action="/single"
                encType="multipart/form-data"
            >
                {' '}
                {/* https://github.com/edmundhung/conform/discussions/547 instructions on how to properly set default values
            This will make it work when JavaScript is turned off as well 
            <Input {...getInputProps(props.fields.address, { type: "text" })} /> */}
                <HomeInformation fields={fields} />
                <CurrentHeatingSystem fields={fields} />
                <EnergyUseHistory />
                <ErrorList id={form.errorId} errors={form.errors} />
                <Button type="submit">Submit</Button>
            </Form>
            <HeatLoadAnalysis />
        </>
    )
}
