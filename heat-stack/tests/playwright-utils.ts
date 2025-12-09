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
import { MOCK_CODE_GITHUB_HEADER } from '#app/utils/providers/constants.js'
import { normalizeEmail } from '#app/utils/providers/provider.js'
import { authSessionStorage } from '#app/utils/session.server.ts'
import { createUser } from './db-utils.ts'
import {
	type GitHubUser,
	deleteGitHubUser,
	insertGitHubUser,
} from './mocks/github.ts'

export * from './db-utils.ts'

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
	const name = `Joe User${random_number}`
	const email = `tempuser${random_number}@fake.com`
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

// We use Playwright's `extend` fixture system here to ensure that any resources (like temporary users)
// created during a test are automatically cleaned up after the test finishes. This prevents test pollution
// and ensures reliable, isolated test runs. Each fixture below uses `use` and a cleanup step afterward.
export const test = base.extend<{
	insertTemporaryUser(options?: InsertOptions): Promise<User>
	loginTemporary(options?: InsertOptions): Promise<User>
	prepareGitHubUser(): Promise<GitHubUser>
}>({
	// This fixture creates a temporary user for the test and ensures that user is deleted after the test completes.
	// The cleanup step (delete) runs automatically after each test, so no manual teardown is needed in test files.
	insertTemporaryUser: async ({}, use) => {
		let userId: string | undefined = undefined
		await use(async (options) => {
			const user = await insertUser(options)
			userId = user.id
			return user
		})
		await prisma.user.delete({ where: { id: userId } }).catch(() => {})
	},
	// This fixture creates and logs in a temporary user, then ensures the user is deleted after the test.
	// The cleanup step (delete) runs automatically after each test, so no manual teardown is needed in test files.
	loginTemporary: async ({ page }, use) => {
		let userId: string | undefined = undefined
		await use(async (options) => {
			const user = await insertUser(options)
			userId = user.id
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
	// This fixture prepares a mock GitHub user for the test and ensures all related resources are cleaned up after the test.
	// The cleanup step (delete) runs automatically after each test, so no manual teardown is needed in test files.
	prepareGitHubUser: async ({ page }, use, testInfo) => {
		await page.route(/\/auth\/github(?!\/callback)/, async (route, request) => {
			const headers = {
				...request.headers(),
				[MOCK_CODE_GITHUB_HEADER]: testInfo.testId,
			}
			await route.continue({ headers })
		})

		let ghUser: GitHubUser | null = null
		await use(async () => {
			const newGitHubUser = await insertGitHubUser(testInfo.testId)!
			ghUser = newGitHubUser
			return newGitHubUser
		})

		const user = await prisma.user.findUnique({
			select: { id: true, name: true },
			where: { email: normalizeEmail(ghUser!.primaryEmail) },
		})
		if (user) {
			await prisma.user.delete({ where: { id: user.id } })
			await prisma.session.deleteMany({ where: { userId: user.id } })
		}
		await deleteGitHubUser(ghUser!.primaryEmail)
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
