import { data, useLoaderData, Link } from 'react-router'
import { format } from 'date-fns'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/index.ts'
import { getUserId } from '#app/utils/auth.server.ts'

export async function loader({ request }: Route.LoaderArgs) {
    const userID = getUserId(request)
    // Fetch all cases with their related data
    const cases = await prisma.case.findMany({
        include: {
            homeOwner: true,
            location: true,
            analysis: {
                include: {
                    heatingInput: {
                        take: 1
                    }
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    })

    return data({ cases })
}

export default function Cases({
    loaderData,
    // actionData,
}: Route.ComponentProps) {
    const { cases } = loaderData

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between">
                <h1 className="mb-6 text-3xl font-bold">Cases</h1>
                <Link
                    to="/single?dev=true"
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                    Create New Case
                </Link>
            </div>

            {cases.length === 0 ? (
                <div className="mt-8 rounded-lg border-2 border-gray-200 p-8 text-center">
                    <h2 className="mb-2 text-xl font-medium text-gray-600">No Cases Found</h2>
                    <p className="mb-4 text-gray-500">Get started by creating your first case analysis.</p>
                    <Link
                        to="/single?dev=true"
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Case ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Home Owner
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Living Area
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Fuel Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {cases.map(caseItem => {
                                const firstAnalysis = caseItem.analysis[0]
                                const heatingInput = firstAnalysis?.heatingInput[0]

                                return (
                                    <tr key={caseItem.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {caseItem.id}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {caseItem.homeOwner.firstName1} {caseItem.homeOwner.lastName1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {caseItem.location.address}, {caseItem.location.city}, {caseItem.location.state}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {caseItem.location.livingAreaSquareFeet} sq ft
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {heatingInput?.fuelType || "N/A"}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Link
                                                to={`/cases/${firstAnalysis?.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 mx-1"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/cases/${firstAnalysis?.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 mx-1"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                to={`/cases/${firstAnalysis?.id}/delete`}
                                                className="text-indigo-600 hover:text-indigo-9001 mx-1"
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
