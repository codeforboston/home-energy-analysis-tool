// Utility function to delete all records in the Case table (and related records via cascade)
export async function deleteAllCases() {
	await prisma.case.deleteMany({})
}
import { invariant } from '@epic-web/invariant'
import type z from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type GetConvertedDatesTIWDResponse } from '#app/utils/date-temp-util.ts'
import { prisma } from '#app/utils/db.server.ts'
import { HomeSchema } from '#types/index.ts'
import { type SchemaZodFromFormType } from '#types/single-form.ts'

export async function getLoggedInUserFromRequest(request: Request) {
	// Use session-based user lookup
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			roles: {
				select: {
					name: true,
					permissions: {
						select: {
							action: true,
							entity: true,
							access: true,
						},
					},
				},
			},
		},
	})
	if (!user) throw new Error('User not found')
	return user
}

// Get all cases with usernames for admin

export type { SchemaZodFromFormType }

/**
 * Return a case assigned to user and all related data necessary for editing a case.
 * @param caseId id of the case
 * @param userId id of the user
 * @returns case and necessary related data required for editing a case.
 */
export const getCaseForEditing = async (
	caseId: number,
	userId: string,
	isAdmin?: boolean,
) => {
	let userWhere
	if (isAdmin) {
		userWhere = {}
	} else {
		userWhere = {
			users: {
				some: {
					id: userId,
				},
			},
		}
	}
	return await prisma.case.findUnique({
		where: { id: caseId, ...userWhere },
		include: {
			homeOwner: true,
			location: true,
			analysis: {
				take: 1, // TODO: WI: Test that latest / correct analysis is returned
				include: {
					heatingInput: {
						take: 1, // TODO: WI: Test that latest / correct heatingInput is returned
						include: {
							processedEnergyBill: true,
						},
					},
					heatingOutput: true, // Include the calculated results for display
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

export const getCases = async (
	userId?: string,
	search?: string | null,
	isAdmin?: boolean,
) => {
	let where1 = undefined
	let where2 = undefined

	if (userId !== 'all') {
		where1 = { users: { some: { id: userId } } }
	}

	if (search && search.trim().length > 0) {
		where2 = {
			OR: [
				// If userId is provided, search within the assigned user(s).
				// case <=> users is a many-to-many relationship
				userId === 'all'
					? { users: { some: { username: { contains: search } } } }
					: undefined,
				{ homeOwner: { firstName1: { contains: search } } },
				{ homeOwner: { lastName1: { contains: search } } },
				{ location: { address: { contains: search } } },
				{ location: { city: { contains: search } } },
				{ location: { state: { contains: search } } },
				{ location: { zipcode: { contains: search } } },
			].filter(Boolean), // filter out undefineds
		}
	}

	const where = { ...where1, ...where2 }

	return await prisma.case.findMany({
		where: where,
		include: {
			homeOwner: true,
			location: true,
			analysis: {
				include: {
					heatingInput: true,
				},
			},
			...(isAdmin ? { users: { select: { username: true } } } : {}),
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
