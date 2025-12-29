import { Form, data, Link, useSubmit } from 'react-router'
import { getCases } from '#app/utils/db/case.db.server.ts'
import { getLoggedInUserFromRequest } from '#app/utils/logic/case.logic.server.ts'
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
	const { cases = [], search, isAdmin } = loaderData
	const submit = useSubmit()
	const typedCases = cases

	return (
		<div className="container mx-auto p-6">
			<div className="mb-4 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
				<h1 className="text-3xl font-bold">Cases</h1>
				<div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
					<Form
						method="GET"
						action="/cases"
						className="flex w-full max-w-sm items-center gap-2"
						onChange={(event) => submit(event.currentTarget)}
					>
						<input
							type="search"
							name="search"
							defaultValue={search ?? ''}
							placeholder="Search by owner or location"
							className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
						<button
							type="submit"
							className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Search
						</button>
					</Form>
					<Link
						to="/cases/new"
						className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					>
						Create New Case
					</Link>
				</div>
				<div id="cases-page" className="container mx-auto p-6">
					<div className="flex items-center justify-between">
						<h1 className="mb-6 text-3xl font-bold">Cases</h1>
						<Link
							to="/cases/new"
							className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
						>
							Create New Case
						</Link>
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
								className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
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
											Home Owner
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
									{typedCases.map((caseItem) => {
										const firstAnalysis = caseItem.analysis[0]
										const heatingInput = firstAnalysis?.heatingInput[0]
										return (
											<tr key={caseItem.id} className="hover:bg-gray-50">
												<td className="whitespace-nowrap px-6 py-4">
													<Link
														to={`/cases/${caseItem.id}/edit?edit_mode=true`}
														className="text-sm font-medium text-indigo-700 underline hover:underline"
													>
														{caseItem.id}
													</Link>
												</td>
												{isAdmin && (
													<td className="whitespace-nowrap px-6 py-4">
														<div className="text-sm text-gray-900">
															{caseItem.users[0]?.username || 'N/A'}
														</div>
													</td>
												)}
												<td className="whitespace-nowrap px-6 py-4">
													<div className="text-sm text-gray-900">
														{caseItem.homeOwner.firstName1}{' '}
														{caseItem.homeOwner.lastName1}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-900">
														{caseItem.location.address},{' '}
														{caseItem.location.city}, {caseItem.location.state}
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
														to={`/cases/${caseItem.id}/edit`}
														className="mx-1 text-indigo-600 hover:text-indigo-900"
													>
														Edit
													</Link>
													<Link
														to={`/cases/${caseItem.id}`}
														className="mx-1 text-indigo-600 hover:text-indigo-900"
													>
														View
													</Link>
													{/* Edit button removed; edit now via Case ID link */}
													<Link
														to={`/cases/${firstAnalysis?.id}/delete`}
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
			</div>
		</div>
	)
}
