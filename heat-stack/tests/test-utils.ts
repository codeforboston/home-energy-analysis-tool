import { faker } from '@faker-js/faker'
import { prisma } from '#app/utils/db.server.ts'
import { createUser, createPassword } from '#tests/db-utils.ts'

export function createFormData() {
	return {
		name: faker.person.fullName(),
		living_area: faker.number.int({ min: 800, max: 5000 }),
		street_address: faker.location.streetAddress(),
		town: faker.location.city(),
		state: faker.location.state({ abbreviated: true }),
		fuel_type: faker.helpers.arrayElement(['GAS', 'OIL', 'PROPANE']) as
			| 'GAS'
			| 'OIL'
			| 'PROPANE',
		heating_system_efficiency: faker.number.float({
			min: 0.7,
			max: 0.98,
			fractionDigits: 2,
		}),
		thermostat_set_point: faker.number.int({ min: 65, max: 75 }),
		setback_temperature: faker.number.int({ min: 60, max: 70 }),
		setback_hours_per_day: faker.number.int({ min: 0, max: 12 }),
		design_temperature_override: faker.number.int({ min: 0, max: 1 }),
		energy_use_upload: {
			name: 'test-file.csv',
			type: 'text/csv',
			size: 1024,
		},
	}
}

export function createLocationData() {
	return {
		state_id: faker.string.uuid(),
		county_id: faker.string.uuid(),
		convertedDatesTIWD: {
			dates: Array.from({ length: 12 }, () =>
				faker.date.recent().toISOString(),
			),
			temperatures: Array.from({ length: 12 }, () =>
				faker.number.float({ min: -10, max: 80 }),
			),
			insulationValues: Array.from({ length: 12 }, () =>
				faker.number.float({ min: 0.1, max: 2.0 }),
			),
			weatherData: Array.from({ length: 12 }, () =>
				faker.number.float({ min: 0, max: 100 }),
			),
		},
		addressComponents: {
			street: faker.location.streetAddress(),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			zip: faker.location.zipCode(),
		},
		coordinates: {
			x: faker.location.longitude(),
			y: faker.location.latitude(),
		},
	}
}

export function createGasBillData() {
	return {
		processed_energy_bills: Array.from({ length: 6 }, () => ({
			period_start_date: faker.date.recent({ days: 365 }).toISOString(),
			period_end_date: faker.date.recent({ days: 30 }).toISOString(),
			usage: faker.number.float({ min: 50, max: 200 }),
			whole_home_heat_loss_rate: faker.number.float({ min: 0.5, max: 5.0 }),
			analysis_type: faker.number.int({ min: 1, max: 3 }),
			default_inclusion: faker.datatype.boolean(),
			inclusion_override: faker.datatype.boolean(),
		})),
		heat_load_output: {
			design_temperature: faker.number.float({ min: -20, max: 20 }),
			whole_home_heat_loss_rate: faker.number.float({ min: 0.5, max: 5.0 }),
			average_heat_load: faker.number.float({ min: 10, max: 100 }),
			maximum_heat_load: faker.number.float({ min: 20, max: 150 }),
		},
	}
}

export async function createTestUser() {
	const userData = createUser()
	const passwordData = createPassword('password123')

	const user = await prisma.user.create({
		data: {
			...userData,
			password: {
				create: passwordData,
			},
		},
	})

	return user
}

export async function createTestCase(userId: string) {
	const homeOwner = await prisma.homeOwner.create({
		data: {
			firstName1: faker.person.firstName(),
			lastName1: faker.person.lastName(),
			email1: faker.internet.email(),
			firstName2: '',
			lastName2: '',
			email2: '',
		},
	})

	const location = await prisma.location.create({
		data: {
			address: faker.location.streetAddress(),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			zipcode: faker.location.zipCode(),
			country: 'USA',
			livingAreaSquareFeet: faker.number.int({ min: 800, max: 5000 }),
			latitude: faker.location.latitude(),
			longitude: faker.location.longitude(),
		},
	})

	const caseRecord = await prisma.case.create({
		data: {
			homeOwnerId: homeOwner.id,
			locationId: location.id,
			users: {
				connect: { id: userId },
			},
		},
		include: {
			homeOwner: true,
			location: true,
		},
	})

	const analysis = await prisma.analysis.create({
		data: {
			caseId: caseRecord.id,
			rules_engine_version: '1.0.0',
		},
	})

	const heatingInput = await prisma.heatingInput.create({
		data: {
			analysisId: analysis.id,
			fuelType: 'GAS',
			designTemperatureOverride: false,
			heatingSystemEfficiency: 85,
			thermostatSetPoint: 68,
			setbackTemperature: 65,
			setbackHoursPerDay: 8,
			numberOfOccupants: 2,
			estimatedWaterHeatingEfficiency: 80,
			standByLosses: 10,
			livingArea: 2000,
		},
	})

	return {
		caseRecord,
		analysis,
		heatingInput,
		homeOwner,
		location,
	}
}

export function createMockFormData(data: Record<string, any>): FormData {
	const formData = new FormData()

	Object.entries(data).forEach(([key, value]) => {
		if (typeof value === 'object' && value.name) {
			// Handle file uploads
			const blob = new Blob([JSON.stringify(value)], {
				type: 'application/json',
			})
			formData.append(key, blob, value.name)
		} else {
			formData.append(key, String(value))
		}
	})

	return formData
}
