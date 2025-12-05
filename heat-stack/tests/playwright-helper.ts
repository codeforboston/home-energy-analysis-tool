import { prisma } from "#app/utils/db.server.ts"

/**
 * UI login method: navigates to login screen and enters username and password
 */
export async function login_with_ui(
	page: any,
	username: string,
	password: string,
) {
	// If already logged in, log out first
	await page.goto('/')
	const cookies = await page.context().cookies()
	const sessionCookie = cookies.find((c: { name: string | any[] }) =>
		c.name.includes('session'),
	)
	if (sessionCookie) {
		// Attempt to log out via UI if logout button exists
		try {
			await page.goto('/logout')
			await page.waitForFunction(
				() => window.location.pathname.includes('/login'),
				null,
				{ timeout: 5000 },
			)
		} catch (e) {
			// Fallback: clear cookies if logout fails
			await page.context().clearCookies()
		}
	}

	await page.goto('/login')
	await page.fill('input[name="username"]', username)
	await page.fill('input[name="password"]', password)
	await page.click('#login-btn-submit')

	// Wait until URL does not include /login
	try {
		await page.waitForURL((url: { pathname: string }) =>
			!url.pathname.includes('/login'),
		    { timeout: 10000 })
	} catch (e) {
const user = await prisma.user.findUnique({
	where: { username: 'adminusername' },
})
if (user) {
	console.log('Debug: User found in database:', user)
} else {
	console.log('Debug: No user found with username adminusername')	
	// User does not exist
}  await page.screenshot({ path: 'expect-timeout.png', fullPage: true });
  throw e;	}
	await page.waitForFunction(
		() => !window.location.pathname.includes('/login'),
		null,
		{ timeout: 10000 },
	)
	console.log('Login complete, current URL:', page.url())
	const newCookies = await page.context().cookies()

	// Verify session cookie exists
	const newSessionCookie = newCookies.find((c: { name: string | any[] }) =>
		c.name.includes('session'),
	)
	if (!newSessionCookie) {
		throw new Error('Session cookie not set after login_with_ui')
	}
}
