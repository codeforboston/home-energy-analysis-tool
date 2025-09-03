import { type GetConvertedDatesTIWDResponse } from '#app/utils/date-temp-util.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type SchemaZodFromFormType } from '#types/single-form.ts'

export const getCaseByIdAndUser = async (caseId: number, userId: string) => {
	const caseRecord = await prisma.case.findUnique({
		where: {
			id: caseId,
			users: {
				some: {
					id: userId,
				},
			},
		},
	})

	return caseRecord
}

export const getCasesByUserId = async (userId: string) => {
	return await prisma.case.findMany({
		where: {
			users: {
				some: {
					id: userId,
				},
			},
		},
		include: {
			homeOwner: true,
			location: true,
			analysis: {
				include: {
					heatingInput: {
						take: 1,
					},
				},
			},
		},
		orderBy: {
			id: 'desc',
		},
	})
}

export const createCase = async (
	formInputs: SchemaZodFromFormType,
	result: GetConvertedDatesTIWDResponse,
	userId: string,
) => {
	const records = await prisma.$transaction(async (tx) => {
		// Save to database using Prisma
		// First create or find HomeOwner
		const homeOwner = await tx.homeOwner.create({
			data: {
				firstName1: formInputs.name.split(' ')[0] || 'Unknown',
				lastName1: formInputs.name.split(' ').slice(1).join(' ') || 'Owner',
				email1: '', // We'll need to add these to the form
				firstName2: '',
				lastName2: '',
				email2: '',
			},
		})

		// Create location using geocoded information
		const location = await tx.location.create({
			data: {
				address: result.addressComponents?.street || formInputs.street_address,
				city: result.addressComponents?.city || formInputs.town,
				state: result.addressComponents?.state || formInputs.state,
				zipcode: result.addressComponents?.zip || '',
				country: 'USA',
				livingAreaSquareFeet: Math.round(formInputs.living_area),
				latitude: result.coordinates?.y || 0,
				longitude: result.coordinates?.x || 0,
			},
		})

		// Create Case
		const caseRecord = await tx.case.create({
			data: {
				homeOwnerId: homeOwner.id,
				locationId: location.id,
				users: {
					connect: {
						id: userId, // connect this case to the user creating the case
					},
				},
			},
		})

		// Create Analysis
		const analysis = await tx.analysis.create({
			data: {
				caseId: caseRecord.id,
				rules_engine_version: '0.0.1',
			},
		})

		// Create HeatingInput
		const heatingInput = await tx.heatingInput.create({
			data: {
				analysisId: analysis.id,
				fuelType: formInputs.fuel_type,
				designTemperatureOverride: Boolean(
					formInputs.design_temperature_override,
				),
				heatingSystemEfficiency: Math.round(
					formInputs.heating_system_efficiency * 100,
				),
				thermostatSetPoint: formInputs.thermostat_set_point,
				setbackTemperature: formInputs.setback_temperature || 65,
				setbackHoursPerDay: formInputs.setback_hours_per_day || 0,
				numberOfOccupants: 2, // Default value until we add to form
				estimatedWaterHeatingEfficiency: 80, // Default value until we add to form
				standByLosses: 5, // Default value until we add to form
				livingArea: formInputs.living_area,
			},
		})

		return {
			homeOwner,
			caseRecord,
			analysis,
			heatingInput,
		}
	})

	return records
}
