import { Form, data, Link, useSubmit } from 'react-router'
import { Icon } from '#app/components/ui/icon.tsx'
import {
	getCases,
	getLoggedInUserFromRequest,
} from '#app/utils/db/case.server.ts'
import { hasAdminRole } from '#app/utils/user.ts'

import { type Route } from './+types/index.ts'

export async function loader({ request }: Route.LoaderArgs) {
	const search = new URL(request.url).searchParams.get('search')
	const loggedInUser = await getLoggedInUserFromRequest(request)
	const isAdmin = hasAdminRole(loggedInUser)
	let cases
	if (isAdmin) {
		cases = await getCases('all', search, true)
	} else {
		cases = await getCases(loggedInUser.id, search, false)
	}
	return data({ cases, search, isAdmin })
}

export default function Cases({
	loaderData,
	// actionData,
}: Route.ComponentProps) {
	const { cases = [], isAdmin, search } = loaderData
	const submit = useSubmit()

	return (
		<div id="cases-page" className="container mx-auto p-6">
			<div className="mb-4 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
				<h1 className="text-3xl font-bold">Cases</h1>
				<div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
					<Form
						method="GET"
						action="/cases"
						className="relative flex w-full max-w-sm"
						onChange={(event) => submit(event.currentTarget)}
					>
						<div className="absolute left-4 top-1/2 -translate-y-1/2">
							<Icon
								name="magnifying-glass"
								className="h-5 w-5 text-emerald-600"
							/>
						</div>
						<input
							type="search"
							name="search"
							defaultValue={search ?? ''}
							placeholder="Search by homeowner or location"
							className="w-full rounded-full border-2 border-emerald-500 bg-white py-2.5 pl-12 pr-4 text-sm shadow-md transition-all focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
						/>
					</Form>
					<Link
						to="/cases/new"
						className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
					>
						Create New Case
					</Link>
				</div>
			</div>
			{cases.length === 0 ? (
				<div className="mt-8 rounded-lg border-2 border-gray-200 p-8 text-center">
					<h2 className="mb-2 text-xl font-medium text-gray-600">
						{search && search.trim().length > 0
							? `No cases found for "${search}".`
							: 'No Cases Found'}
					</h2>
					<p className="mb-4 text-gray-500">
						Get started by creating your first case analysis.
					</p>
					<Link
						to="/cases/new"
						className="inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
					>
						📈 Create New Case
					</Link>
				</div>
			) : (
				<div className="mt-6 overflow-hidden rounded-lg border">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Case ID
								</th>
								{isAdmin && (
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
									>
										Username
									</th>
								)}
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Homeowner
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Location
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Living Area
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Fuel Type
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{cases.map((caseItem) => {
								const firstAnalysis = caseItem.analysis[0]
								const heatingInput = firstAnalysis?.heatingInput[0]

								return (
									<tr key={caseItem.id} className="hover:bg-gray-50">
										<td className="whitespace-nowrap px-6 py-4">
											<div className="text-sm font-medium text-gray-900">
												<Link
													to={`/cases/${caseItem.id}/edit?edit_mode=true`}
													className="text-sm font-medium text-indigo-700 underline hover:underline"
												>
													{caseItem.id}
												</Link>
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<div className="text-sm text-gray-900">
												{caseItem.homeOwner.firstName1}{' '}
												{caseItem.homeOwner.lastName1}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-900">
												{caseItem.location.address}, {caseItem.location.city},{' '}
												{caseItem.location.state}
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<div className="text-sm text-gray-900">
												{caseItem.location.livingAreaSquareFeet} sq ft
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<div className="text-sm text-gray-900">
												{heatingInput?.fuelType || 'N/A'}
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<Link
												to={`/cases/${firstAnalysis?.id}`}
												className="mx-1 text-indigo-600 hover:text-indigo-900"
											>
												View
											</Link>
											<Link
												to={`/cases/${caseItem.id}/edit`}
												className="mx-1 text-indigo-600 hover:text-indigo-900"
											>
												Edit
											</Link>
											<Link
												to={`/cases/${caseItem.id}/delete`}
												className="hover:text-indigo-9001 mx-1 text-indigo-600"
											>
												Delete
											</Link>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
