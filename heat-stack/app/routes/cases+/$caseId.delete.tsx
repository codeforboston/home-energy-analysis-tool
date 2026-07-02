import { invariantResponse } from '@epic-web/invariant'
import { Form, Link, redirect } from 'react-router'
import { requireUserId } from '#app/utils/auth.server'
import {
	deleteCaseWithUser,
	getLoggedInUserFromRequest,
} from '#app/utils/db/case.server'
import { hasAdminRole } from '#app/utils/user.ts'
import { type Route } from './+types/$caseId.delete'

export async function action({ request, params }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const user = await getLoggedInUserFromRequest(request)
	const isAdmin = hasAdminRole(user)
	const caseId = Number(params.caseId)

	invariantResponse(!isNaN(caseId), 'Invalid case ID', {
		status: 400,
	})

	await deleteCaseWithUser(caseId, userId, isAdmin)

	return redirect('/cases')
}

export default function DeleteCase() {
	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4">
			<div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-lg">
				<h1 className="mb-2 text-2xl font-bold text-gray-900">Delete Case</h1>

				<p className="mb-6 text-gray-600">
					Are you sure you want to permanently delete this case?
				</p>

				<p className="mb-8 rounded-md bg-red-50 p-3 text-sm text-red-700">
					This action cannot be undone.
				</p>

				<div className="flex justify-end gap-3">
					<Link
						to="/cases"
						className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
					>
						Cancel
					</Link>

					<Form method="post">
						<button
							type="submit"
							className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
						>
							Delete Case
						</button>
					</Form>
				</div>
			</div>
		</div>
	)
}
