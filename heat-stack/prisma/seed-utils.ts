import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

export function createPassword(password: string = faker.internet.password()) {
	return {
		hash: bcrypt.hashSync(password, 10),
	}
}

import { getPasswordHash } from '#app/utils/auth.server.ts'
import {
	createCase,
	type SchemaZodFromFormType,
} from '#app/utils/db/case.server'
import { prisma } from '#app/utils/db.server.ts'

// --- insertUser ---
type InsertOptions = {
	username?: string
	password?: string
	is_admin?: boolean
}

type Role = {
	id: string
	name: string
}
type User = {
	id: string
	email: string
	username: string
	name: string | null
	has_admin_role?: boolean
	roles: Role[]
}

export async function insertSeedUser(
	{ username, password, is_admin }: InsertOptions = {},
	caseCount: number = 2,
): Promise<User> {
	const random_number = Math.floor(Math.random() * 1000000)
	const insertUsername = username || `tempuser${random_number}`
	const name = `Joe Homeowner${random_number}`
	const email = `fake_email${random_number}@fake.com`
	const userPassword = password ?? 'password123'
	const rolesConnect = is_admin ? { roles: { connect: { name: 'admin' } } } : {}
	console.log(
		`Inserting user: ${insertUsername} (admin: ${is_admin ? 'yes' : 'no'})`,
	)
	const user = await prisma.user.create({
		data: {
			username: insertUsername,
			name,
			email,
			password: { create: { hash: await getPasswordHash(userPassword) } },
			...rolesConnect,
		},
		include: { roles: true },
	})
	await createSampleCases({ username: user.username, id: user.id }, caseCount)
	return user
}

// --- createSampleCases ---
function mockCaseInput(username: string, idx: number): SchemaZodFromFormType {
	return {
		name: `${username} Owner ${idx}`,
		street_address: `123 Main St Apt ${idx}`,
		town: 'Testville',
		state: 'MA',
		living_area: 1500 + idx * 100,
		fuel_type: 'GAS' as 'GAS',
		design_temperature_override: 65,
		heating_system_efficiency: 0.85,
		thermostat_set_point: 68,
		setback_temperature: 62,
		setback_hours_per_day: 8,
		energy_use_upload: {
			name: `energy${idx}.csv`,
			type: 'text/csv',
			size: 1234 + idx,
		},
	}
}

function mockConvertedDates(idx: number) {
	return {
		convertedDatesTIWD: {
			dates: ['2025-01-01', '2025-01-31'],
			temperatures: [32, 30],
		},
		state_id: 'MA',
		county_id: idx,
		coordinates: { x: -71.1, y: 42.3 },
		addressComponents: {
			city: 'Testville',
			state: 'MA',
			zip: '02139',
			street: `123${idx} Main St`,
			formattedAddress: `123${idx} Main St, Testville, MA 02139`,
		},
	}
}

export async function createSampleCases(
	user: { username: string; id: string },
	caseCount: number,
): Promise<void> {
	for (let i = 1; i <= caseCount; i++) {
		const caseResult = await createCase(
			mockCaseInput(user.username, i),
			mockConvertedDates(i),
			user.id,
		)
		// Add a billing record to the heatingInput
		if (caseResult.analysis && caseResult.heatingInput) {
			await prisma.processedEnergyBill.create({
				data: {
					analysisInputId: caseResult.heatingInput.id,
					periodStartDate: new Date(2025, 0, i),
					periodEndDate: new Date(2025, 0, i + 1),
					usageQuantity: 100 + i * 10,
					analysisType: 1,
					defaultInclusion: true,
					invertDefaultInclusion: false,
				},
			})
		}
	}
}
