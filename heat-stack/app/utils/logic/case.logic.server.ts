import { invariant } from '@epic-web/invariant'

import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import {
	insertProcessedBills,
	deleteBillsForAnalysis,
} from '#app/utils/db/bill.db.server.ts'
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

/**
 * processes CSV (uploadTextFile) and create a new case, and runs pyodide
 **/

export async function processCaseSubmission(
	submission: any,
	userId: string,
	formData: FormData,
) {
	const parsedForm = submission.value
	const uploadedTextFile: string = await fileUploadHandler(formData)

	const pyodideProxy: PyProxy = executeParseGasBillPy(uploadedTextFile)
	const pyodideResults = pyodideProxy.toJs()
	// TODO: make function that destroys if it exists
	// pyodideProxy.destroy()

	const result = await getConvertedDatesTIWD(
		pyodideResults,
		parsedForm.street_address,
		parsedForm.town,
		parsedForm.state,
	)

	const { convertedDatesTIWD, state_id, county_id } = result
	invariant(state_id, 'Missing state_id')
	invariant(county_id, 'Missing county_id')

	const gasBillDataProxy: PyProxy = executeGetAnalyticsFromFormJs(
		parsedForm,
		convertedDatesTIWD,
		uploadedTextFile,
		state_id,
		county_id,
	)
	const gasBillData = gasBillDataProxy.toJs()
	// gasBillDataProxy.destroy()

	const newCase = await createCaseRecord(
		parsedForm,
		result,
		userId,
		gasBillData,
	)

	// Get the HeatingInput ID from the created analysis
	const heatingInputId = newCase.analysis?.heatingInput?.[0]?.id
	invariant(heatingInputId, 'Failed to create HeatingInput record')

	const insertedCount = await insertProcessedBills(heatingInputId, gasBillData)

	return {
		newCase,
		gasBillData,
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
	submission: any,
	userId: string,
	formData: FormData,
) {
	const parsedForm = submission.value
	const uploadedTextFile: string = await fileUploadHandler(formData)

	const pyodideProxy: PyProxy = executeParseGasBillPy(uploadedTextFile)
	const pyodideResults = pyodideProxy.toJs()
	// pyodideProxy.destroy()

	const result = await getConvertedDatesTIWD(
		pyodideResults,
		parsedForm.street_address,
		parsedForm.town,
		parsedForm.state,
	)

	const { convertedDatesTIWD, state_id, county_id } = result
	invariant(state_id, 'Missing state_id')
	invariant(county_id, 'Missing county_id')

	const gasBillDataProxy: PyProxy = executeGetAnalyticsFromFormJs(
		parsedForm,
		convertedDatesTIWD,
		uploadedTextFile,
		state_id,
		county_id,
	)
	const gasBillData = gasBillDataProxy.toJs()
	//gasBillDataProxy.destroy()

	const updatedCase = await updateCaseRecord(caseId, parsedForm, result, userId)

	// Get the HeatingInput ID from the updated case
	const heatingInputId = updatedCase?.analysis?.[0]?.heatingInput?.[0]?.id
	if (!heatingInputId) {
		throw new Error('Failed to find HeatingInput record for update')
	}

	// Delete existing bills and insert new ones
	await deleteBillsForAnalysis(heatingInputId)
	const insertedCount = await insertProcessedBills(heatingInputId, gasBillData)

	return {
		updatedCase,
		gasBillData,
		insertedCount,
		state_id,
		county_id,
		convertedDatesTIWD,
	}
}
