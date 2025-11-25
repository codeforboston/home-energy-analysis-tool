import { login_existing } from '../playwright-helper'
import { test, expect } from '../playwright-utils'

test('Admin sees Manage Users option in dropdown', async ({ page }) => {
  // Log in as admin using login_existing helper
  // await login_existing(page, 'admin')
  await page.goto('/')
  // Open the user dropdown (simulate click on trigger)
  await page.getByRole('button').click()
  // Check for Manage Users option in dropdown
  await expect(page.getByRole('menuitem', { name: /Manage Users/i })).toBeVisible()
})
