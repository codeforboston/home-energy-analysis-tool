// seed-users.ts
import { type User } from '@prisma/client'
import { createCase, type SchemaZodFromFormType  } from '#app/utils/db/case.server'
import { prisma } from '#app/utils/db.server'
import { getOrInsertUser } from '#tests/db-utils'

// Helper to create mock case input
function mockCaseInput(username: string, idx: number): SchemaZodFromFormType {
	return {
		name: `${username} Owner ${idx}`,
		street_address: `123${idx} Main St`,
		town: 'Testville',
		state: 'MA',
		living_area: 1500 + idx * 100,
		fuel_type: "GAS" as "GAS", // explicit literal
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

export const adminUser: User = await getOrInsertUser({
	username: 'adminusername',
	name: 'John Admin',
	is_admin: true,
})

export const normalUser: User = await getOrInsertUser({
	username: 'normalusername',
	name: 'Jane User',
	is_admin: false,
})

export const otherUsers: User[] = await Promise.all([
	getOrInsertUser({ username: 'user1', name: 'User One' }),
	getOrInsertUser({ username: 'user2', name: 'User Two' }),
	getOrInsertUser({ username: 'user3', name: 'User Three' }),
])

// Create 2–3 cases for each user
const allUsers = [adminUser, normalUser, ...otherUsers]
for (const user of allUsers) {
	for (let i = 1; i <= 3; i++) {
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
			});
		}
	}
}
