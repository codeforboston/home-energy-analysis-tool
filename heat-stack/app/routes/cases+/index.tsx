import Fuse from 'fuse.js'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { Form, data, Link, useSubmit } from 'react-router'
import { Icon } from '#app/components/ui/icon.tsx'
import { Input } from '#app/components/ui/input.tsx'
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

	// fuze search needs to filter on as many cases as possible.
	// searching on the empty string allows for the search to be done later while still allowing for filtering based on authorization.
	if (isAdmin) {
		cases = await getCases('all', '', true)
	} else {
		cases = await getCases(loggedInUser.id, '', false)
	}
	return data({ cases, search, isAdmin })
}

export default function Cases({
	loaderData,
	// actionData,
}: Route.ComponentProps) {
	const { cases = [], isAdmin, search } = loaderData
	const submit = useSubmit()

	const fuse = useMemo(
		() =>
			new Fuse(cases, {
				keys: [
					'homeOwner.firstName1',
					'homeOwner.lastName1',
					'users.some.email',
					'users.some.username',
					'location.city',
					'location.state',
					'location.address',
					'location.zipcode',
				],
				includeScore: true,
				threshold: 0.3,
			}),
		[cases],
	)

	let filtered_cases = fuse
		.search(search ?? '')
		.map((fuseResult) => fuseResult.item)

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
						<Input
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
			{filtered_cases.length === 0 ? (
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
							{filtered_cases.map((caseItem) => {
								const firstAnalysis = caseItem.analysis[0]
								const heatingInput = firstAnalysis?.heatingInput[0]

								return (
									<tr
										key={caseItem.id}
										className="border-b border-gray-100 transition-colors duration-150 hover:bg-indigo-50"
									>
										<td className="whitespace-nowrap px-6 py-4">
											<Link
												to={`/cases/${caseItem.id}/edit?edit_mode=true`}
												className="font-mono text-sm font-semibold text-indigo-700 hover:text-indigo-900"
											>
												#{caseItem.id}
											</Link>
										</td>

										{isAdmin && (
											<td className="px-6 py-4">
												<div className="text-sm text-gray-700">
													{caseItem.users.map((u) => u.username).join(', ')}
												</div>
											</td>
										)}

										<td className="px-6 py-4">
											<div className="font-medium text-gray-900">
												{caseItem.homeOwner.firstName1}{' '}
												{caseItem.homeOwner.lastName1}
											</div>
										</td>

										<td className="px-6 py-4">
											<div className="text-sm text-gray-700">
												{caseItem.location.address}, {caseItem.location.city},{' '}
												{caseItem.location.state}
											</div>
										</td>

										<td className="whitespace-nowrap px-6 py-4">
											<span className="font-semibold text-gray-900">
												{caseItem.location.livingAreaSquareFeet.toLocaleString()}
											</span>
											<span className="ml-1 text-sm text-gray-500">sq ft</span>
										</td>

										<td className="whitespace-nowrap px-6 py-4">
											<span
												className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
													heatingInput?.fuelType === 'Natural Gas'
														? 'bg-green-100 text-green-700'
														: heatingInput?.fuelType === 'Oil'
															? 'bg-orange-100 text-orange-700'
															: heatingInput?.fuelType === 'Electric'
																? 'bg-blue-100 text-blue-700'
																: 'bg-gray-100 text-gray-600'
												}`}
											>
												{heatingInput?.fuelType || 'N/A'}
											</span>
										</td>

										<td className="whitespace-nowrap px-6 py-4">
											<div className="flex items-center gap-2">
												<Link
													to={`/cases/${firstAnalysis?.id}`}
													className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700"
													title="View"
												>
													<Eye className="h-5 w-5" />
												</Link>

												<Link
													to={`/cases/${caseItem.id}/edit`}
													className="rounded-md p-2 text-amber-600 transition hover:bg-amber-100 hover:text-amber-700"
													title="Edit"
												>
													<Pencil className="h-5 w-5" />
												</Link>

												<Link
													to={`/cases/${caseItem.id}/delete`}
													className="rounded-md p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700"
													title="Delete"
												>
													<Trash2 className="h-5 w-5" />
												</Link>
											</div>
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
