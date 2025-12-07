import { test as base } from '@playwright/test'
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
import { getFormattedDateForName } from './utils.ts'
import { get } from 'lodash'

export * from './db-utils.ts'

type InsertOptions = {
	password?: string
	isAdmin?: boolean
	isAuth?: boolean
}

type User = {
	id: string
	email: string
	username: string
	name: string | null
}

async function insertUser({
	password,
	isAdmin,
	isAuth = false,
}: InsertOptions = {}): Promise<User> {
	const userWord = (isAuth ? 'cur' : 'oth') + (isAdmin ? 'adm' : 'norm')
	// const date_str = getFormattedDateForName()
	const random_number = Math.floor(Math.random() * 1000000)
	const date_str = getFormattedDateForName();
	const username = `${userWord}${random_number}`
	const name = `Joe Smith-${userWord}${date_str}`
	const email = `temp${userWord}${date_str}@fake.com`
	const userPassword = password ?? 'password123'
	console.log("debug password", userPassword);
	const rolesConnect = isAdmin ? { connect: { name: 'admin' } } : {}
	return await prisma.user.create({
		data: {
			username,
			name,
			email,
			password: { create: { hash: await getPasswordHash(userPassword) } },
			...rolesConnect,
		},
	})
}

export const test = base.extend<{
	insertTemporaryUser(options?: InsertOptions): Promise<User>
	loginTemporary(options?: InsertOptions): Promise<User>
	prepareGitHubUser(): Promise<GitHubUser>
}>({
	insertTemporaryUser: async ({}, use) => {
		let userId: string | undefined = undefined
		await use(async (options) => {
			const user = await insertUser(options)
			userId = user.id
			return user
		})
		await prisma.user.delete({ where: { id: userId } }).catch(() => {})
	},
	loginTemporary: async ({ page }, use) => {
		let userId: string | undefined = undefined
		await use(async (options) => {
			const user = await insertUser({...options, isAuth: true })
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
