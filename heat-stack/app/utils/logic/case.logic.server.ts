import { invariant } from '@epic-web/invariant'
// TODO: comment out unused code
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import { insertProcessedBills } from '#app/utils/db/bill.db.server.ts'
import {
	createCaseRecord,
	updateCaseRecord,
} from '#app/utils/db/case.db.server.ts'
import { fileUploadHandler } from '#app/utils/file-upload-handler.ts'
import {
	executeParseGasBillPy,
	executeGetNormalizedOutput,
} from '#app/utils/rules-engine.ts'
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import { type NaturalGasBillRecord, type NaturalGasUsageDataSchema } from '#types/index.ts'
import { fa } from '#node_modules/@faker-js/faker/dist'

/**
 * processes CSV (uploadTextFile) and create a new case, and runs pyodide
 **/

export async function calculateWithCsv(
	formData: FormData, // form as a dictionary and a file - needed for file
	parsedForm: any, // form values as a parsed object - needed for pycall
	userId: string,
) {
	const uploadedTextFile: string = await fileUploadHandler(formData)
	const pyodideProxy: PyProxy = executeParseGasBillPy(uploadedTextFile)
	const billsFromPy = pyodideProxy.toJs() as NaturalGasUsageDataSchema
	console.log("Debug: Gas Billing Data from Pyodide", billsFromPy.get("records"));

	// Create bills array of type NaturalGasBillRecord from parsed records
	const parsedRecords = billsFromPy.get("records") as any[];
	console.log("Debug: Parsed Records", parsedRecords[0], parsedRecords[1], parsedRecords[2]);
	const bills = parsedRecords.map(record => ({
		periodStartDate: new Date(record["period_start_date"]),
		periodEndDate: new Date(record["period_end_date"]),
		usageTherms : Number(record["usage_therms"]),
		inclusionOverride: false
	}))
	console.log("Debug: Parsed Bills 2", parsedRecords[0], parsedRecords[1], parsedRecords[2])
	// pyodideProxy.destroy()
	const { rulesEngineResult, state_id, county_id, convertedDatesTIWD } =
		await calculateWithBills(parsedForm, bills)
	return await caseCreate({
		parsedForm,
		convertedDatesTIWD,
		state_id,
		county_id,
		userId,
		rulesEngineResult,
	})
}
export async function calculateWithBills(
	parsedForm: any,
	// TODO: Use a type from index.ts
	bills: Array<{
		periodStartDate: Date,
		periodEndDate: Date,
		usageTherms: number,
		inclusionOverride: number,
	}>
) {
	// Calculate overall_start_date and overall_end_date from bills
	const overall_start_date = new Date(Math.min(...bills.map(b => new Date(b.periodStartDate).getTime())));
	const overall_end_date = new Date(Math.max(...bills.map(b => new Date(b.periodEndDate).getTime())));

	// Create billsIso: copy of bills with ISO date strings
	const billsPyReady = bills.map(bill => ({
		periodStartDate: bill.periodStartDate instanceof Date ? bill.periodStartDate.toISOString() : String(bill.periodStartDate),
		periodEndDate: bill.periodEndDate instanceof Date ? bill.periodEndDate.toISOString() : String(bill.periodEndDate),
		usageTherms: bill.usageTherms || 0,
		inclusionOverride: bill.inclusionOverride || false,
	}));

	const { convertedDatesTIWD, state_id, county_id } =
		await getConvertedDatesTIWD(
			overall_start_date,
			overall_end_date,
			parsedForm.street_address,
			parsedForm.town,
			parsedForm.state,
		)

	invariant(state_id, 'Missing state_id')
	invariant(county_id, 'Missing county_id')

	// Use billsIso for Python interop if needed
	console.log("Debug here")
	const rulesEngineResultProxy: PyProxy = executeGetNormalizedOutput(
		parsedForm,
		convertedDatesTIWD,
		billsPyReady,
		state_id,
		county_id,
	)
	const rulesEngineResult = rulesEngineResultProxy.toJs()
	rulesEngineResultProxy.destroy()
	return { rulesEngineResult, state_id, county_id, convertedDatesTIWD }
}
export async function caseCreate({
	parsedForm,
	convertedDatesTIWD,
	state_id,
	county_id,
	userId,
	rulesEngineResult,
}: any) {
	const newCase = await createCaseRecord(
		parsedForm,
		{ convertedDatesTIWD, state_id, county_id },
		userId,
		rulesEngineResult,
	)

	// Get the HeatingInput ID from the created analysis
	const heatingInputId = newCase.analysis?.heatingInput?.[0]?.id
	invariant(heatingInputId, 'Failed to create HeatingInput record')

	const insertedCount = await insertProcessedBills(
		heatingInputId,
		rulesEngineResult,
	)

	return {
		newCase,
		rulesEngineResult,
		insertedCount,
		state_id,
		county_id,
		convertedDatesTIWD,
	}
}

/**
 * processes CSV (uploadTextFile) and update an existing case, and runs pyodide
 */
export async function processCaseUpdate(
	caseId: number,
	parsedForm: any,
	userId: string,
	gasBillingData: NaturalGasUsageDataSchema,
) {
	const { rulesEngineResult, state_id, county_id, convertedDatesTIWD } =
		await calculateWithBills(parsedForm, gasBillingData)
	console.log('🔄 Updating case record in database...', rulesEngineResult)

	const updatedCase = await updateCaseRecord(
		caseId,
		parsedForm,
		{ convertedDatesTIWD, state_id, county_id },
		userId,
	)
	return {
		updatedCase,
		gasBillData: rulesEngineResult,
		state_id,
		county_id,
		convertedDatesTIWD,
	}
}
