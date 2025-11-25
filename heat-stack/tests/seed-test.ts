// seed-users.ts
import { type User } from '@prisma/client'
import { getOrInsertUser } from '#tests/db-utils'

export const adminUser: User = await getOrInsertUser({
	username: 'admin',
	name: 'John Admin',
	is_admin: true,
})

export const normalUser: User = await getOrInsertUser({
	username: 'user',
	name: 'Jane User',
	is_admin: false,
})

export const otherUsers: User[] = await Promise.all([
	getOrInsertUser({ username: 'user1', name: 'User One' }),
	getOrInsertUser({ username: 'user2', name: 'User Two' }),
	getOrInsertUser({ username: 'user3', name: 'User Three' }),
])

