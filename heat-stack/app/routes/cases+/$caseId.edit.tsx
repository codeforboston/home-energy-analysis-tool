import { requireUserId } from '#app/utils/auth.server.ts'
import { getCaseByIdAndUser } from '#app/utils/db/cases.server.ts'
import { invariantResponse } from '#node_modules/@epic-web/invariant/dist'
import { type Route } from './+types/$caseId.edit'

export async function loader({ request, params }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const caseId = parseInt(params.caseId)

	invariantResponse(!isNaN(caseId), 'Invalid case ID', { status: 400 })

	const caseRecord = await getCaseByIdAndUser(caseId, userId)
	invariantResponse(caseRecord, 'Case not found', { status: 404 })

	return { caseRecord }
}

export default function EditCase({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			Hello world
			<pre>{JSON.stringify(loaderData, null, 2)}</pre>
		</div>
	)
}
