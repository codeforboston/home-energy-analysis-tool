import * as pyodideModule from 'pyodide'

/* 
    LOAD PYODIDE 
*/
const getPyodide = async () => {
    return await pyodideModule.loadPyodide({
        const isServer = typeof window === 'undefined';
        const basePath = isServer ? 'public/pyodide-env/' : '/pyodide-env/';
        
        // This path is actually `public/pyodide-env`, but the browser knows where `public` is. Note that remix server needs `public/`
        // TODO: figure out how to determine if we're in browser or remix server and use ternary.
        indexURL: 'public/pyodide-env/',
    })
}
const runPythonScript = async () => {
    const pyodide: any = await getPyodide()
    return pyodide
}
// consider running https://github.com/codeforboston/home-energy-analysis-tool/blob/main/python/tests/test_rules_engine/test_engine.py
const pyodide: any = await runPythonScript()

/* 
    LOAD PACKAGES 
    NOTES for pydantic, typing-extensions, annotated_types: 
        pyodide should match pyodide-core somewhat. 
        typing-extensions needs specific version per https://github.com/pyodide/pyodide/issues/4234#issuecomment-1771735148
        try getting it from 
        - https://pypi.org/project/pydantic/#files
        - https://pypi.org/project/typing-extensions/
        - https://pypi.org/project/annotated-types/#files
*/
await pyodide.loadPackage(
    'public/pyodide-env/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl',
)
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

/* 
    RULES-ENGINE CALLS
*/
/**
 * CSV Parser
 * Need to parse the gas bill first to determine the start and end dates of the bill
 * so that we can request the weather for those dates.
 */
export const executeParseGasBillPy = await pyodide.runPythonAsync(`
    from rules_engine import parser
    from rules_engine.pydantic_models import (
        FuelType,
        HeatLoadInput,
        TemperatureInput
    )
    from rules_engine import engine

    def executeParse(csvDataJs):
        naturalGasInputRecords = parser.parse_gas_bill(csvDataJs, parser.NaturalGasCompany.NATIONAL_GRID)
        return naturalGasInputRecords.model_dump(mode="json")
    executeParse
`)
/**
 * Full call with csv data
 * call to get_outputs_natural_gas
 */
export const executeGetAnalyticsFromFormJs = await pyodide.runPythonAsync(`
    from rules_engine import parser
    from rules_engine.pydantic_models import (
        FuelType,
        HeatLoadInput,
        TemperatureInput
    )
    from rules_engine import engine, helpers

    def executeGetAnalyticsFromForm(summaryInputJs, temperatureInputJs, csvDataJs, state_id, county_id):
        """
        second step: this will be the first time to draw the table
        # two new geocode parameters may be needed for design temp:
        # watch out for helpers.get_design_temp( addressMatches[0].geographies.counties[0]['STATE'] , addressMatches[0].geographies.counties[0]['COUNTY'] county_id) 
        # in addition to latitude and longitude from GeocodeUtil.ts object .
        # pack the get_design_temp output into heat_load_input
        """
        
        summaryInputFromJs = summaryInputJs.as_object_map().values()._mapping
        temperatureInputFromJs =temperatureInputJs.as_object_map().values()._mapping

        # We will just pass in this data
        naturalGasInputRecords = parser.parse_gas_bill(csvDataJs, parser.NaturalGasCompany.NATIONAL_GRID)

        design_temp_looked_up = helpers.get_design_temp(state_id, county_id)
        summaryInput = HeatLoadInput( **summaryInputFromJs, design_temperature=design_temp_looked_up)

        temperatureInput = TemperatureInput(**temperatureInputFromJs)

        outputs = engine.get_outputs_natural_gas(summaryInput, temperatureInput, naturalGasInputRecords)

        return outputs.model_dump(mode="json")
    executeGetAnalyticsFromForm
`)
/**
 * Full call with userAdjustedData
 * second time and after, when table is modified, this becomes entrypoint
 */
export const executeRoundtripAnalyticsFromFormJs = await pyodide.runPythonAsync(`
    from rules_engine import parser
    from rules_engine.pydantic_models import (
        FuelType,
        HeatLoadInput,
        TemperatureInput,
        ProcessedEnergyBillInput
    )
    from rules_engine import engine, helpers


    def executeRoundtripAnalyticsFromForm(summaryInputJs, temperatureInputJs, userAdjustedData, state_id, county_id):
        """
        "processed_energy_bills" is the "roundtripping" parameter to be passed as userAdjustedData.
        """
        
        summaryInputFromJs = summaryInputJs.as_object_map().values()._mapping
        temperatureInputFromJs =temperatureInputJs.as_object_map().values()._mapping

        design_temp_looked_up = helpers.get_design_temp(state_id, county_id)
        # expect 1 for middlesex county:  print("design temp check ",design_temp_looked_up, state_id, county_id)
        summaryInput = HeatLoadInput( **summaryInputFromJs, design_temperature=design_temp_looked_up)

        temperatureInput = TemperatureInput(**temperatureInputFromJs)

        # third step, re-run of the table data
        userAdjustedDataFromJsToPython = [ProcessedEnergyBillInput(**record) for record in userAdjustedData['processed_energy_bills'] ]
        # print("py", userAdjustedDataFromJsToPython[0])

        outputs2 = engine.get_outputs_normalized(summaryInput, None, temperatureInput, userAdjustedDataFromJsToPython)

        # print("py2", outputs2.processed_energy_bills[0])
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
      'processed_energy_bills' => [
    Map(9) {
      'period_start_date' => '2020-10-02',
      'period_end_date' => '2020-11-04',
      'usage' => 29,
      'analysis_type_override' => undefined,
      'inclusion_override' => false,
      'analysis_type' => 0,
      'default_inclusion' => false,
      'eliminated_as_outlier' => false,
      'whole_home_heat_loss_rate' => undefined
    }, */