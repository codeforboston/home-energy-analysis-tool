import { parseWithZod } from '@conform-to/zod'
import { parseMultipartFormData } from '@remix-run/server-runtime/dist/formData.js'
import { data } from 'react-router'
import { CaseForm } from '#app/components/ui/heat/CaseSummaryComponents/CaseForm.tsx'
import { getUserId } from '#app/utils/auth.server.ts'
import { replacer } from '#app/utils/data-parser.ts'
import getConvertedDatesTIWD from '#app/utils/date-temp-util.ts'
import { createCaseData } from '#app/utils/db/case.server.ts'
import { uploadHandler, fileUploadHandler } from '#app/utils/file-upload-handler.ts'
import { executeParseGasBillPy, executeGetAnalyticsFromFormJs } from '#app/utils/rules-engine.ts'
import  { type PyProxy } from '#public/pyodide-env/ffi.js'
import { Schema } from '#types/single-form.ts'
import  { type NaturalGasUsageDataSchema } from '../../../types/types.ts'
import { type Route } from './+types/new.ts'

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const isDevMode = url.searchParams.get('dev')?.toLowerCase() === 'true'
	return { isDevMode }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await getUserId(request)
	const formData = await parseMultipartFormData(request, uploadHandler)
	const uploadedTextFile = await fileUploadHandler(formData)

	const submission = parseWithZod(formData, { schema: Schema })
	if (submission.status !== 'success') return { submitResult: submission.reply() }

	const parsedForm = submission.value

	try {
		const pyodideResultsFromTextFilePyProxy: PyProxy = executeParseGasBillPy(uploadedTextFile)
		const pyodideResultsFromTextFile: NaturalGasUsageDataSchema =
			pyodideResultsFromTextFilePyProxy.toJs()
		pyodideResultsFromTextFilePyProxy.destroy()

		const result = await getConvertedDatesTIWD(
			pyodideResultsFromTextFile,
			parsedForm.street_address,
			parsedForm.town,
			parsedForm.state,
		)

		let caseRecord, analysis, heatingInput
		if (process.env.FEATUREFLAG_PRISMA_HEAT_BETA2 === 'true' && userId) {
			; ({ caseRecord, analysis, heatingInput } = await createCaseData(parsedForm, result, userId))
		}

		const gasBillDataPyProxy: PyProxy = executeGetAnalyticsFromFormJs(
			parsedForm,
			result.convertedDatesTIWD,
			uploadedTextFile,
			result.state_id,
			result.county_id,
		)
		const gasBillData = gasBillDataPyProxy.toJs()
		gasBillDataPyProxy.destroy()

		return {
			submitResult: submission.reply(),
			data: JSON.stringify(gasBillData, replacer),
			parsedAndValidatedFormSchema: parsedForm,
			convertedDatesTIWD: result.convertedDatesTIWD,
			state_id: result.state_id,
			county_id: result.county_id,
			caseInfo: {
				caseId: caseRecord?.id,
				analysisId: analysis?.id,
				heatingInputId: heatingInput?.id,
			},
		}
	} catch (error) {
		console.error(error)
		return {
			submitResult: submission.reply({
				formErrors: [error instanceof Error ? error.message : 'Unknown Error'],
			}),
		}
	}
}

export default function SingleRoute({ loaderData, actionData }: Route.ComponentProps) {
	return <CaseForm loaderData={loaderData} actionData={actionData as any} />
}
