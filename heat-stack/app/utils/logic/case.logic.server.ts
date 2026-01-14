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
	executeGetAnalyticsFromFormJs,
} from '#app/utils/rules-engine.ts'
import { type PyProxy } from '#public/pyodide-env/ffi.js'
import { type NaturalGasUsageDataSchema } from '#types/index.ts'

/**
 * processes CSV (uploadTextFile) and create a new case, and runs pyodide
 **/

export async function processCaseSubmission(
	formData: FormData, // form as a dictionary and a file - needed for file
	parsedForm: any, // form values as a parsed object - needed for pycall
	userId: string,
) {
	const uploadedTextFile: string = await fileUploadHandler(formData)
	const pyodideProxy: PyProxy = executeParseGasBillPy(uploadedTextFile)
	const gasBillingData = pyodideProxy.toJs() as NaturalGasUsageDataSchema
	// pyodideProxy.destroy()
	const { rulesEngineResult, state_id, county_id, convertedDatesTIWD } =
		await processCaseSubmission2(parsedForm, gasBillingData)
	return await caseCreate({
		parsedForm,
		convertedDatesTIWD,
		state_id,
		county_id,
		userId,
		rulesEngineResult,
	})
}
export async function processCaseSubmission2(
	parsedForm: any, // form values as a parsed object - needed for pycall
	gasBillingData: NaturalGasUsageDataSchema,
) {
	const { convertedDatesTIWD, state_id, county_id } =
		await getConvertedDatesTIWD(
			gasBillingData,
			parsedForm.street_address,
			parsedForm.town,
			parsedForm.state,
		)

	invariant(state_id, 'Missing state_id')
	invariant(county_id, 'Missing county_id')

	const rulesEngineResultProxy: PyProxy = executeGetAnalyticsFromFormJs(
		parsedForm,
		convertedDatesTIWD,
		gasBillingData,
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
		await processCaseSubmission2(parsedForm, gasBillingData)

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
