/**
 * UI login method: navigates to login screen and enters username and password
 */
export async function login_with_ui(page: any, username: string, password: string) {
  await page.goto('/login')
  await page.fill('input[name="username"]', username)
  await page.fill('input[name="password"]', password)
  await page.click('#login-btn-submit')
}
