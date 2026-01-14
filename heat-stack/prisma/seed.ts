import { prisma } from '#app/utils/db.server.ts'
import { insertSeedUser } from './seed-utils.js'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	const totalUsers = 5
	console.time(`👤 Created ${totalUsers} users and cases...`)
	for (let i = 0; i < totalUsers; i++) {
		await insertSeedUser({}, 2)
		// Optionally, you can also create cases for each user
	}
	console.timeEnd(`👤 Created ${totalUsers} users and cases...`)

	console.time(`🐨 Created admin user "kody"`)

	// Create kody user using insertUser (some info like connections will be lost)
	await insertSeedUser(
		{ username: 'kody', password: 'kodylovesyou', is_admin: true },
		3,
	)
	await insertSeedUser(
		{ username: 'normaluser', password: 'normaluserpassword', is_admin: false },
		2,
	)

	console.timeEnd(`🐨 Created admin user "kody"`)

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

// we're ok to import from the test directory in this file
/*
eslint
	no-restricted-imports: "off",
*/
