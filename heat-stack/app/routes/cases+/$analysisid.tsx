import { invariantResponse } from '@epic-web/invariant'
import { data } from 'react-router'
import { requireUserId } from '#app/utils/auth.server.ts'
import { getLoggedInUserFromRequest } from '#app/utils/db/case.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { hasAdminRole } from '#app/utils/user.ts'
import { type Route } from './+types/$analysisid.ts'

export async function loader({ params, request }: Route.LoaderArgs) {
	const analysisId = Number(params.analysisid)

	// Make sure analysisId is a valid number
	invariantResponse(!isNaN(analysisId), 'Invalid analysis ID', { status: 400 })

	// Security: require authenticated user and check ownership
	const userId = await requireUserId(request)
	const user = await getLoggedInUserFromRequest(request)
	const isAdmin = hasAdminRole(user)

	// Fetch the case and all related information
	const caseData = await prisma.case.findFirst({
		where: {
			analysis: {
				some: {
					id: analysisId,
				},
			},
			// Ownership check: non-admin users can only view their own cases
			...(!isAdmin ? { users: { some: { id: userId } } } : {}),
		},
		include: {
			homeOwner: true,
			location: true,
			analysis: {
				where: {
					id: analysisId,
				},
				include: {
					heatingInput: true,
					heatingOutput: true,
				},
			},
		},
	})

	// If no case found, return 404
	invariantResponse(caseData, 'Case not found', { status: 404 })

	return data({ caseData })
}

export default function Analysis({
	loaderData,
	// actionData,
}: Route.ComponentProps) {
	const { caseData } = loaderData
	const analysis = caseData.analysis[0]
	const heatingInput = analysis?.heatingInput[0]
	const heatingOutput = analysis?.heatingOutput[0]

	return (
		<div className="container mx-auto p-6">
			<h1 className="mb-6 text-3xl font-bold">Case Analysis #{caseData.id}</h1>
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Homeowner Information */}
				<div className="rounded-lg border p-4 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">Homeowner</h2>
					<p className="mb-2">
						<span className="font-medium">Name:</span>{' '}
						{caseData.homeOwner.firstName1} {caseData.homeOwner.lastName1}
					</p>
					{caseData.homeOwner.email1 && (
						<p className="mb-2">
							<span className="font-medium">Email:</span>{' '}
							{caseData.homeOwner.email1}
						</p>
					)}
					{caseData.homeOwner.firstName2 && (
						<p className="mb-2">
							<span className="font-medium">Second Owner:</span>{' '}
							{caseData.homeOwner.firstName2} {caseData.homeOwner.lastName2}
						</p>
					)}
				</div>

				{/* Location Information */}
				<div className="rounded-lg border p-4 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">Location</h2>
					<p className="mb-2">
						<span className="font-medium">Address:</span>{' '}
						{caseData.location.address}
					</p>
					<p className="mb-2">
						<span className="font-medium">City:</span> {caseData.location.city}
					</p>
					<p className="mb-2">
						<span className="font-medium">State:</span>{' '}
						{caseData.location.state}
					</p>
					<p className="mb-2">
						<span className="font-medium">Zipcode:</span>{' '}
						{caseData.location.zipcode}
					</p>
					<p className="mb-2">
						<span className="font-medium">Living Area:</span>{' '}
						{caseData.location.livingAreaSquareFeet} sq ft
					</p>
					{(caseData.location.latitude !== 0 ||
						caseData.location.longitude !== 0) && (
							<p className="mb-2">
								<span className="font-medium">Coordinates:</span>{' '}
								{caseData.location.latitude}, {caseData.location.longitude}
							</p>
						)}
				</div>
			</div>
			{/* Heating Input */}
			{heatingInput && (
				<div className="mb-8 rounded-lg border p-4 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">Heating System</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<p>
							<span className="font-medium">Fuel Type:</span>{' '}
							{heatingInput.fuelType}
						</p>
						<p>
							<span className="font-medium">Heating System Efficiency:</span>{' '}
							{heatingInput.heatingSystemEfficiency}%
						</p>
						<p>
							<span className="font-medium">Thermostat Set Point:</span>{' '}
							{heatingInput.thermostatSetPoint}°F
						</p>
						<p>
							<span className="font-medium">Setback Temperature:</span>{' '}
							{heatingInput.setbackTemperature}°F
						</p>
						<p>
							<span className="font-medium">Setback Hours Per Day:</span>{' '}
						</p>
						<p>
							<span className="font-medium">Number of Occupants:</span>{' '}
							{heatingInput.numberOfOccupants}
						</p>
						<p>
							<span className="font-medium">Water Heating Efficiency:</span>{' '}
							{heatingInput.estimatedWaterHeatingEfficiency}%
						</p>
						<p>
							<span className="font-medium">Stand By Losses:</span>{' '}
							{heatingInput.standByLosses}%
						</p>
						<p>
							<span className="font-medium">Living Area:</span>{' '}
							{heatingInput.livingArea} sq ft
						</p>
					</div>
				</div>
			)}
			{/* Heating Output */}
			{heatingOutput && (
				<div className="mb-8 rounded-lg border p-4 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">
						Heat Load Analysis Results
					</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<p>
							<span className="font-medium">Estimated Balance Point:</span>{' '}
							{heatingOutput.estimatedBalancePoint}°F
						</p>
						<p>
							<span className="font-medium">Design Temperature:</span>{' '}
							{heatingOutput.designTemperature}°F
						</p>
						<p>
							<span className="font-medium">Whole Home Heat Loss Rate:</span>{' '}
							{Math.round(heatingOutput.wholeHomeHeatLossRate)} BTU/hr-°F
						</p>
						<p>
							<span className="font-medium">Average Heat Load:</span>{' '}
							{Math.round(heatingOutput.averageHeatLoad)} BTU/hr
						</p>
						<p>
							<span className="font-medium">Maximum Heat Load:</span>{' '}
							{Math.round(heatingOutput.maximumHeatLoad)} BTU/hr
						</p>
						<p>
							<span className="font-medium">Average Indoor Temperature:</span>{' '}
							{heatingOutput.averageIndoorTemperature}°F
						</p>
						<p>
							<span className="font-medium">Other Fuel Usage:</span>{' '}
							{heatingOutput.otherFuelUsage}
						</p>
						<p>
							<span className="font-medium">Std Dev of Heat Loss Rate:</span>{' '}
							{heatingOutput.standardDeviationOfHeatLossRate}
						</p>
					</div>
				</div>
			)}

			<div className="mt-6">
				<a
					href={`/cases/new`}
					className="inline-block rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
				>
					Create Another Analysis
				</a>
				<a
					href={`/cases/${caseData.id}/edit`}
					className="inline-block rounded bg-emerald-600 px-4 py-2 mx-4 text-white hover:bg-emerald-700"
				>
					Edit This Case
				</a>
			</div>

		</div>
	)
}
