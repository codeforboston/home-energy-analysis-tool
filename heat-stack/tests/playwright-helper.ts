/**
 * UI login method: navigates to login screen and enters username and password
 */
export async function login_with_ui(
	page: any,
	username: string,
	password: string,
) {
	await page.goto('/login')
	await page.fill('input[name="username"]', username)
	await page.fill('input[name="password"]', password)
	await page.click('#login-btn-submit')

	// Wait until URL does not include /login
	await page.waitForFunction(() => !window.location.pathname.includes('/login'), null, { timeout: 10000 })
	console.log('Login complete, current URL:', page.url())
	const cookies = await page.context().cookies()

	// Log current page URL after login
	// Verify session cookie exists
	const sessionCookie = cookies.find((c: { name: string | any[] }) => c.name.includes('session'))
	if (!sessionCookie) {
		throw new Error('Session cookie not set after login_with_ui')
	}
}
