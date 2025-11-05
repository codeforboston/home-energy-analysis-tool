import { invariant } from '@epic-web/invariant'
import type z from 'zod'
import { type GetConvertedDatesTIWDResponse } from '#app/utils/date-temp-util.ts'
import { prisma } from '#app/utils/db.server.ts'
import { HomeSchema } from '#types/index.ts'
import { type SchemaZodFromFormType } from '#types/single-form.ts'

// export const getCaseByIdAndUser = async (caseId: number, userId: string) => {
// 	const caseRecord = await prisma.case.findUnique({
// 		where: {
// 			id: caseId,
// 			users: {
// 				some: {
// 					id: userId,
// 				},
// 			},
// 		},
// 	})

// 	return caseRecord
// }

/**
 * Return a case assigned to user and all related data necessary for editing a case.
 * @param caseId id of the case
 * @param userId id of the user
 * @returns case and necessary related data required for editing a case.
 */
export const getCaseForEditing = async (caseId: number, userId: string) => {
	return await prisma.case.findUnique({
		where: {
			id: caseId,
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
				take: 1, // TODO: WI: Test that latest / correct analysis is returned
				include: {
					heatingInput: {
						take: 1, // TODO: WI: Test that latest / correct heatingInput is returned
					},
					analysisDataFile: {
						take: 1,
						include: {
							EnergyUsageFile: true,
						},
					},
				},
			},
		},
	})
}

export const deleteCaseWithUser = async (caseId: number, userId: string) => {
	// WIll need to delete:
	// 1. analysis
	// 2. csv records
	// 3. Do we leave location and homeOwner alone?
	return await prisma.case.delete({
		where: {
			id: caseId,
			users: {
				some: {
					id: userId,
				},
			},
		},
	})
}

export const getCasesByUser = async (userId: string) => {
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

const HeatingInputSchema = HomeSchema.pick({
	fuel_type: true,
	design_temperature_override: true,
	heating_system_efficiency: true,
	thermostat_set_point: true,
	setback_temperature: true,
	setback_hours_per_day: true,
	living_area: true,
})

export const updateCase = async (
	caseId: number,
	userId: string,
	changes: {
		heatingInput: z.infer<typeof HeatingInputSchema>
	},
) => {
	/**
	 * X - 0. Find location
	 * X - 0.1. Find homeowner
	 * X - 0.2. Test what happens if you change location or homeowner so fields are no longer unique
	 * 1. Update case info data
	 * 2. Create new EnergyUsageFileRecord
	 * 3. Create new AnalysisDataFile
	 * 4. Create new analysis input
	 * 5. Create new analysis output
	 */

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

	// TODO: WI: Test this path
	invariant(caseRecord, 'Case not found')

	// Create Analysis
	const analysis = await prisma.analysis.create({
		data: {
			caseId: caseRecord.id,
			// TODO: WI: Create constant for rules engine version
			rules_engine_version: '0.0.1',
		},
	})
	// Create HeatingInput
	const validHI = HeatingInputSchema.parse(changes.heatingInput)

	await prisma.heatingInput.create({
		data: {
			analysisId: analysis.id,
			fuelType: changes.heatingInput.fuel_type,
			designTemperatureOverride: Boolean(validHI.design_temperature_override),
			// TODO: WI: CREATE ISSUE TO QUESTION WHAT IS THE BEST WAY TO SAVE EFFICIENCY (PROBLEM IS DECIMAL VS WHOLE NUMBER PERCENT)
			heatingSystemEfficiency: Math.round(
				validHI.heating_system_efficiency * 100,
			),
			thermostatSetPoint: validHI.thermostat_set_point,
			setbackTemperature: validHI.setback_temperature || 65,
			setbackHoursPerDay: validHI.setback_hours_per_day || 0,
			numberOfOccupants: 2, // Default value until we add to form
			estimatedWaterHeatingEfficiency: 80, // Default value until we add to form
			standByLosses: 5, // Default value until we add to form
			livingArea: validHI.living_area,
		},
	})
	// Create HeatingOutput

	// Create EnergyDataFile

	// Create AnalysisDataFile
}

// TODO: WI: Check if we have any prisma tests
// 			 If not, create tests to make sure that the proper
// 			 records are created and that the relationships expected exist as they should
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
		console.log('Location saved is ', {
			addressComponents: result.addressComponents,
			formInputComponents: {
				street_address: formInputs.street_address,
				town: formInputs.town,
				state: formInputs.state,
				living_area: formInputs.living_area,
			},
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
		const location = await tx.location.create({
			data: {
				// address: result.addressComponents?.street || formInputs.street_address,
				// TODO: WI: Answer is to user the user submitted data if the data is provided
				address: formInputs.street_address,
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
