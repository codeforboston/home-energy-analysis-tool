import { invariantResponse } from '@epic-web/invariant'
import { data } from 'react-router'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/$analysisid.ts'

export async function loader({ params }: Route.LoaderArgs) {
	const analysisId = Number(params.analysisid)

	// Make sure analysisId is a valid number
	invariantResponse(!isNaN(analysisId), 'Invalid analysis ID', { status: 400 })

	// Fetch the case and all related information
	const caseData = await prisma.case.findFirst({
		where: {
			analysis: {
				some: {
					id: analysisId,
				},
			},
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
				{/* Home Owner Information */}
				<div className="rounded-lg border p-4 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">Home Owner</h2>
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

			{/* Heating System Information */}
			{heatingInput && (
				<div className="mb-8 rounded-lg border p-4 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">Heating System</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<p>
							<span className="font-medium">Fuel Type:</span>{' '}
							{heatingInput.fuelType}
						</p>
						<p>
							<span className="font-medium">System Efficiency:</span>{' '}
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
							<span className="font-medium">Setback Hours:</span>{' '}
							{heatingInput.setbackHoursPerDay} hours/day
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

			{/* Heat Load Analysis Results */}
			{heatingOutput && (
				<div className="rounded-lg border p-4 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">
						Heat Load Analysis Results
					</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
					</div>
				</div>
			)}

			<div className="mt-6">
				<a
					href={`/new?dev=true`}
					className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					Create Another Analysis
				</a>
			</div>
		</div>
	)
}
