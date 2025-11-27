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

	// Wait for post-login element (e.g., navigation bar or dashboard)
	try {
		await page.waitForSelector('#navbar', { timeout: 5000 })
		console.log('Post-login element #navbar is visible.')
	} catch (e) {
		console.log(
			'Post-login element #navbar not found. Current URL:',
			page.url(),
		)
	}

	// Log current page URL after login
	console.log('Page URL after login_with_ui:', page.url())

	// Log cookies after login
	const cookies = await page.context().cookies()
	console.log('Cookies after login_with_ui:', cookies)
	// Verify session cookie exists
	const sessionCookie = cookies.find((c: { name: string | any[] }) => c.name.includes('session'))
	console.log('Session cookie after login_with_ui:', sessionCookie)
	if (!sessionCookie) {
		throw new Error('Session cookie not set after login_with_ui')
	}
}
