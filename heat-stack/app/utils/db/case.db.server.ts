import { prisma } from '#app/utils/db.server.ts'

export async function createCaseRecord(
	formValues: any,
	latitude: number,
	longitude: number,
	userId: string,
	rulesEngineOutput?: Map<string, any>,
) {
	// Create HomeOwner first
	const homeOwner = await prisma.homeOwner.create({
		// Form is only collecting name field for now
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
			latitude: latitude, // Will need to be populated from geocoding
			longitude: longitude, // Will need to be populated from geocoding
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

	// Extract heat load output from rules engine results if available
	const heatLoadOutput = rulesEngineOutput?.get('heat_load_output')
	const heatingOutputData = heatLoadOutput
		? {
				estimatedBalancePoint:
					heatLoadOutput.get('estimated_balance_point') || 0,
				otherFuelUsage: heatLoadOutput.get('other_fuel_usage') || 0,
				averageIndoorTemperature:
					heatLoadOutput.get('average_indoor_temperature') || 0,
				differenceBetweenTiAndTbp:
					heatLoadOutput.get('difference_between_ti_and_tbp') || 0,
				designTemperature: heatLoadOutput.get('design_temperature') || 0,
				wholeHomeHeatLossRate:
					heatLoadOutput.get('whole_home_heat_loss_rate') || 0,
				standardDeviationOfHeatLossRate:
					heatLoadOutput.get('standard_deviation_of_heat_loss_rate') || 0,
				averageHeatLoad: heatLoadOutput.get('average_heat_load') || 0,
				maximumHeatLoad: heatLoadOutput.get('maximum_heat_load') || 0,
			}
		: undefined

	// Create Analysis with HeatingInput and HeatingOutput
	const analysis = await prisma.analysis.create({
		data: {
			caseId: newCase.id,
			rules_engine_version: '1.0.0',
			heatingInput: {
				create: {
					fuelType: formValues.fuel_type,
					designTemperatureOverride: false,
					heatingSystemEfficiency: Math.round(
						formValues.heating_system_efficiency * 100,
					),
					thermostatSetPoint: formValues.thermostat_set_point,
					setbackTemperature: formValues.setback_temperature,
					setbackHoursPerDay: formValues.setback_hours_per_day,
					numberOfOccupants: 2, // Default value
					estimatedWaterHeatingEfficiency: 80, // Default value
					standByLosses: 10, // Default value
					livingArea: formValues.living_area,
				},
			},
			// Create HeatingOutput if we have rules engine results
			...(heatingOutputData && {
				heatingOutput: {
					create: heatingOutputData,
				},
			}),
		},
		include: {
			heatingInput: true,
			heatingOutput: true,
		},
	})

	return {
		...newCase,
		analysis: analysis,
	}
}

export async function updateCaseRecord(
	caseId: number,
	formValues: any,
	_locationData: any,
	_userId: string,
	billingRecords?: any[],
	heatLoadOutput?: any,
) {
	// Get the existing case with its relations
	const existingCase = await prisma.case.findUnique({
		where: { id: caseId },
		include: {
			homeOwner: true,
			location: true,
			analysis: {
				include: {
					heatingInput: {
						include: {
							processedEnergyBill: true,
						},
					},
					heatingOutput: true,
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
	if (
		firstAnalysis?.heatingInput?.length &&
		firstAnalysis.heatingInput.length > 0
	) {
		const firstHeatingInput = firstAnalysis.heatingInput[0]
		if (firstHeatingInput) {
			await prisma.heatingInput.update({
				where: { id: firstHeatingInput.id },
				data: {
					fuelType: formValues.fuel_type,
					heatingSystemEfficiency: Math.round(
						formValues.heating_system_efficiency * 100,
					),
					thermostatSetPoint: formValues.thermostat_set_point,
					setbackTemperature: formValues.setback_temperature,
					setbackHoursPerDay: formValues.setback_hours_per_day,
					livingArea: formValues.living_area,
				},
			})

			// Update billing records if provided
			if (billingRecords && billingRecords.length > 0) {
				const existingBillingRecords =
					firstHeatingInput.processedEnergyBill || []

				// Update each billing record's inclusion_override field
				for (
					let i = 0;
					i < Math.min(billingRecords.length, existingBillingRecords.length);
					i++
				) {
					const updatedRecord = billingRecords[i]
					const existingRecord = existingBillingRecords[i]

					if (existingRecord && updatedRecord) {
						await prisma.processedEnergyBill.update({
							where: { id: existingRecord.id },
							data: {
								invertDefaultInclusion:
									updatedRecord.inclusion_override || false,
							},
						})
					}
				}
			}
		}
	}

	// Update heating output if provided
	if (
		heatLoadOutput &&
		firstAnalysis?.heatingOutput?.length &&
		firstAnalysis.heatingOutput.length > 0
	) {
		const firstHeatingOutput = firstAnalysis.heatingOutput[0]
		if (firstHeatingOutput) {
			await prisma.heatingOutput.update({
				where: { id: firstHeatingOutput.id },
				data: {
					estimatedBalancePoint: heatLoadOutput.estimated_balance_point,
					otherFuelUsage: heatLoadOutput.other_fuel_usage,
					averageIndoorTemperature: heatLoadOutput.average_indoor_temperature,
					differenceBetweenTiAndTbp:
						heatLoadOutput.difference_between_ti_and_tbp,
					designTemperature: heatLoadOutput.design_temperature,
					wholeHomeHeatLossRate: heatLoadOutput.whole_home_heat_loss_rate,
					standardDeviationOfHeatLossRate:
						heatLoadOutput.standard_deviation_of_heat_loss_rate,
					averageHeatLoad: heatLoadOutput.average_heat_load,
					maximumHeatLoad: heatLoadOutput.maximum_heat_load,
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

export const getCase = async (caseId: number, userId: string) => {
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
	console.log('debug', where)

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
