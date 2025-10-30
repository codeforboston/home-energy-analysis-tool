import { prisma } from '#app/utils/db.server.ts'

export async function createCaseRecord(formValues: any, _locationData: any, userId: string) {
	
	// Create HomeOwner first
	const homeOwner = await prisma.homeOwner.create({
		data: {
			firstName1: formValues.name || 'Unknown',
			lastName1: '',
			email1: '',
			firstName2: '',
			lastName2: '',
			email2: '',
		},
	})

	// Create Location
	const location = await prisma.location.create({
		data: {
			address: formValues.street_address,
			city: formValues.town,
			state: formValues.state,
			zipcode: '',
			country: 'USA',
			livingAreaSquareFeet: formValues.living_area,
			latitude: 0, // Will need to be populated from geocoding
			longitude: 0, // Will need to be populated from geocoding
		},
	})

	// Create Case
	const newCase = await prisma.case.create({
		data: {
			homeOwnerId: homeOwner.id,
			locationId: location.id,
			users: {
				connect: { id: userId },
			},
		},
		include: { 
			analysis: true,
			homeOwner: true,
			location: true,
		},
	})

	// Create Analysis with HeatingInput
	const analysis = await prisma.analysis.create({
		data: {
			caseId: newCase.id,
			rules_engine_version: '1.0.0',
			heatingInput: {
				create: {
					fuelType: formValues.fuel_type,
					designTemperatureOverride: false,
					heatingSystemEfficiency: Math.round(formValues.heating_system_efficiency * 100),
					thermostatSetPoint: formValues.thermostat_set_point,
					setbackTemperature: formValues.setback_temperature,
					setbackHoursPerDay: formValues.setback_hours_per_day,
					numberOfOccupants: 2, // Default value
					estimatedWaterHeatingEfficiency: 80, // Default value
					standByLosses: 10, // Default value
					livingArea: formValues.living_area,
				},
			},
		},
		include: {
			heatingInput: true,
		},
	})

	return {
		...newCase,
		analysis: analysis,
	}
}

export async function updateCaseRecord(caseId: number, formValues: any, _locationData: any, _userId: string) {
	// Get the existing case with its relations
	const existingCase = await prisma.case.findUnique({
		where: { id: caseId },
		include: { 
			homeOwner: true, 
			location: true,
			analysis: {
				include: {
					heatingInput: true,
				},
			},
		},
	})

	if (!existingCase) {
		throw new Error(`Case with id ${caseId} not found`)
	}

	// Update HomeOwner
	await prisma.homeOwner.update({
		where: { id: existingCase.homeOwnerId },
		data: {
			firstName1: formValues.name || 'Unknown',
		},
	})

	// Update Location
	await prisma.location.update({
		where: { id: existingCase.locationId },
		data: {
			address: formValues.street_address,
			city: formValues.town,
			state: formValues.state,
			livingAreaSquareFeet: formValues.living_area,
		},
	})

	// Update HeatingInput if it exists
	const firstAnalysis = existingCase.analysis[0]
	if (firstAnalysis?.heatingInput?.length && firstAnalysis.heatingInput.length > 0) {
		const firstHeatingInput = firstAnalysis.heatingInput[0]
		if (firstHeatingInput) {
			await prisma.heatingInput.update({
				where: { id: firstHeatingInput.id },
				data: {
					fuelType: formValues.fuel_type,
					heatingSystemEfficiency: Math.round(formValues.heating_system_efficiency * 100),
					thermostatSetPoint: formValues.thermostat_set_point,
					setbackTemperature: formValues.setback_temperature,
					setbackHoursPerDay: formValues.setback_hours_per_day,
					livingArea: formValues.living_area,
				},
			})
		}
	}

	// Return updated case
	const updatedCase = await prisma.case.findUnique({
		where: { id: caseId },
		include: { 
			analysis: {
				include: {
					heatingInput: true,
					heatingOutput: true,
				},
			},
			homeOwner: true,
			location: true,
		},
	})

	return updatedCase
}