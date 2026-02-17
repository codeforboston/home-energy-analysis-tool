import { invariant } from '@epic-web/invariant'
import { convertPyBills } from '#app/utils/convert.ts'
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import { insertProcessedBills } from '#app/utils/db/bill.db.server.ts'
import { createCaseRecord, updateCaseRecord } from '#app/utils/db/case.db.server.ts'
import { fileUploadHandler } from '#app/utils/file-upload-handler.ts'
import { executeParseGasBillPy, executeGetNormalizedOutput } from '#app/utils/rules-engine.ts'
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import { type NaturalGasUsageDataSchema } from '#types/index.ts'

/**
 * processes CSV (uploadTextFile) and create a new case, and runs pyodide
 */
export async function calculateWithCsv(
	formData: FormData,
	parsedForm: any,
) {
	const uploadedTextFile: string = await fileUploadHandler(formData)
	console.log('Debug-1: Uploaded text file content')
	const pyodideProxy: PyProxy = executeParseGasBillPy(uploadedTextFile)
	console.log('Debug: pyodideProxy from executeParseGasBillPy', pyodideProxy)
	const records = pyodideProxy.toJs().get('records') as any
	console.log('Debug-2: Parsed Records', records[0], records[1], records[2])
	const parsedBills = convertPyBills(records)
	console.log('Debug: bills', parsedBills[0], parsedBills[1], parsedBills[2])
	// pyodideProxy.destroy()
	return await calculateWithBills(parsedForm, parsedBills)
}

export async function createNewCase({
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

export async function processNewCase({ formData, parsedForm, userId }: { formData: FormData, parsedForm: any, userId: string }) {
	const calcResult = await calculateWithCsv(formData, parsedForm)
	return await createNewCase({
		...calcResult,
		parsedForm,
		userId,
	})
}
export async function calculateWithBills(
	parsedForm: any,
	// TODO: Use a type from index.ts
	bills: Array<{
		periodStartDate: Date | string,
		periodEndDate: Date | string,
		usageTherms: number,
		inclusionOverride: number | boolean,
	}>
) {
	// Calculate overall_start_date and overall_end_date from bills
	const overall_start_date = new Date(Math.min(...bills.map(b => new Date(b.periodStartDate).getTime())))
	const overall_end_date = new Date(Math.max(...bills.map(b => new Date(b.periodEndDate).getTime())))

	// Convert bills to Map<'records', ...> format expected by executeGetNormalizedOutput
	const billsPyReady: Map<'records', Array<{
		periodStartDate: Date
		periodEndDate: Date
		usageQuantity: number
		inclusionOverride: number
	}>> = new Map([
		[
			'records',
			bills.map(bill => ({
				periodStartDate:
					bill.periodStartDate instanceof Date
						? bill.periodStartDate
						: new Date(bill.periodStartDate),
				periodEndDate:
					bill.periodEndDate instanceof Date
						? bill.periodEndDate
						: new Date(bill.periodEndDate),
				usageQuantity: bill.usageTherms || 0,
				inclusionOverride: typeof bill.inclusionOverride === 'boolean' ? (bill.inclusionOverride ? 1 : 0) : bill.inclusionOverride || 0,
			})),
		]
	])

	const { convertedDatesTIWD, state_id, county_id } = await getConvertedDatesTIWD(
		overall_start_date,
		overall_end_date,
		parsedForm.street_address,
		parsedForm.town,
		parsedForm.state,
	)

	invariant(state_id, 'Missing state_id')
	invariant(county_id, 'Missing county_id')

	// Use billsIso for Python interop if needed
	const rulesEngineResultProxy: PyProxy = executeGetNormalizedOutput(
		parsedForm,
		convertedDatesTIWD,
		billsPyReady,
		state_id,
		county_id,
	)
	const rulesEngineResult = rulesEngineResultProxy.toJs()
	// rulesEngineResultProxy.destroy()
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
	// Convert Map to array if needed
	let billsArray: Array<{
		periodStartDate: Date | string,
		periodEndDate: Date | string,
		usageTherms: number,
		inclusionOverride: number | boolean,
	}> = []
	let billsMap: Map<string, any> | null = null
	if (gasBillingData instanceof Map && gasBillingData.has('records')) {
		billsMap = gasBillingData
	} else if (Array.isArray(gasBillingData) && !(gasBillingData instanceof Map)) {
		billsArray = gasBillingData as Array<{
			periodStartDate: Date | string,
			periodEndDate: Date | string,
			usageTherms: number,
			inclusionOverride: number | boolean,
		}>
	}
	const { rulesEngineResult, state_id, county_id, convertedDatesTIWD } =
		billsMap
			? await calculateWithBills(parsedForm, billsMap.get('records').map((rec: any) => ({
					periodStartDate: rec.periodStartDate,
					periodEndDate: rec.periodEndDate,
					usageTherms: rec.usageQuantity,
					inclusionOverride: rec.inclusionOverride,
				})))
			: await calculateWithBills(parsedForm, billsArray)
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
