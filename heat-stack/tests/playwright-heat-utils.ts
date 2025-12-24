// ...existing imports and types...

import { test as base } from '@playwright/test'
// NOTE: The Playwright fixtures below must be defined inline with `base.extend`.
// If these were moved to separate functions and imported, Playwright would not be able to
// automatically manage their lifecycle and cleanup after each test. This is because Playwright's
// fixture system relies on direct registration within the test context, not on imported helpers.
// Keeping them here ensures proper setup and teardown for reliable, isolated tests.
import { type User as UserModel } from '@prisma/client'
import * as setCookieParser from 'set-cookie-parser'
import {
	getPasswordHash,
	getSessionExpirationDate,
	sessionKey,
} from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { authSessionStorage } from '#app/utils/session.server.ts'

type InsertOptions = {
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

async function insertUser({
	password,
	is_admin,
}: InsertOptions = {}): Promise<User> {
	const random_number = Math.floor(Math.random() * 1000000)
	const username = `tempuser${random_number}`
	const name = `Joe Homeowner${random_number}`
	const email = `fake_email${random_number}@fake.com`
	const userPassword = password ?? 'password123'
	const rolesConnect = is_admin ? { roles: { connect: { name: 'admin' } } } : {}
	return await prisma.user.create({
		data: {
			username,
			name,
			email,
			password: { create: { hash: await getPasswordHash(userPassword) } },
			...rolesConnect,
		},
		include: { roles: true },
	})
}

// Helper to delete all data related to a user's cases
async function deleteUserCaseRelatedData(userId?: string) {
	if (!userId) return
	// Find all cases associated with the user, including analysis and homeOwnerId
	const cases = await prisma.case.findMany({
		where: { users: { some: { id: userId } } },
		select: { id: true, analysis: { select: { id: true } }, homeOwnerId: true },
	})
	const caseIds = cases.map((c) => c.id)
	if (caseIds.length === 0) return
	// Collect all analysis IDs for these cases
	const analysisIds = cases.flatMap((c) => c.analysis.map((a) => a.id))
	// Delete related heatingOutput and heatingInput for each analysis
	if (analysisIds.length > 0) {
		await prisma.heatingOutput.deleteMany({
			where: { analysisId: { in: analysisIds } },
		})
		await prisma.heatingInput.deleteMany({
			where: { analysisId: { in: analysisIds } },
		})
		await prisma.analysis.deleteMany({ where: { id: { in: analysisIds } } })
	}
	// Delete homeOwners for these cases
	const homeOwnerIds = cases.map((c) => c.homeOwnerId)
	if (homeOwnerIds.length > 0) {
		await prisma.homeOwner.deleteMany({ where: { id: { in: homeOwnerIds } } })
	}
	// Finally, delete the cases
	await prisma.case.deleteMany({ where: { id: { in: caseIds } } })
}

// We use Playwright's `extend` fixture system here to ensure that any resources (like temporary users)
// created during a test are automatically cleaned up after the test finishes. This prevents test pollution
// and ensures reliable, isolated test runs. Each fixture below uses `use` and a cleanup step afterward.
export const test = base.extend<{
	insertTemporaryUser(options?: InsertOptions): Promise<User>
	insertAndLoginTemporaryUser(options?: InsertOptions): Promise<User>
}>({
	// This fixture creates a temporary user for the test and ensures that user is deleted after the test completes.
	// The cleanup step (delete) runs automatically after each test, so no manual teardown is needed in test files.
	insertTemporaryUser: async ({}, use) => {
		let userId: string | undefined = undefined
		await use(async (options) => {
			const user = await insertUser(options)
			userId = user.id
			// ...existing code...
			return user
		})
		await deleteUserCaseRelatedData(userId)
		await prisma.user.delete({ where: { id: userId } }).catch(() => {})
	},
	// This fixture creates and logs in a temporary user, then ensures the user is deleted after the test.
	// The cleanup step (delete) runs automatically after each test, so no manual teardown is needed in test files.
	insertAndLoginTemporaryUser: async ({ page }, use) => {
		let userId: string | undefined = undefined
		await use(async (options) => {
			const user = await insertUser(options)
			userId = user.id
			// ...existing code...
			const session = await prisma.session.create({
				data: {
					expirationDate: getSessionExpirationDate(),
					userId: user.id,
				},
				select: { id: true },
			})

			const authSession = await authSessionStorage.getSession()
			authSession.set(sessionKey, session.id)
			const cookieConfig = setCookieParser.parseString(
				await authSessionStorage.commitSession(authSession),
			)
			const newConfig = {
				...cookieConfig,
				domain: 'localhost',
				expires: cookieConfig.expires?.getTime(),
				sameSite: cookieConfig.sameSite as 'Strict' | 'Lax' | 'None',
			}
			await page.context().addCookies([newConfig])
			return user
		})
		await prisma.user.deleteMany({ where: { id: userId } })
	},
})
export const { expect } = test

/**
 * This allows you to wait for something (like an email to be available).
 *
 * It calls the callback every 50ms until it returns a value (and does not throw
 * an error). After the timeout, it will throw the last error that was thrown or
 * throw the error message provided as a fallback
 */
export async function waitFor<ReturnValue>(
	cb: () => ReturnValue | Promise<ReturnValue>,
	{
		errorMessage,
		timeout = 5000,
	}: { errorMessage?: string; timeout?: number } = {},
) {
	const endTime = Date.now() + timeout
	let lastError: unknown = new Error(errorMessage)
	while (Date.now() < endTime) {
		try {
			const response = await cb()
			if (response) return response
		} catch (e: unknown) {
			lastError = e
		}
		await new Promise((r) => setTimeout(r, 100))
	}
	throw lastError
}
