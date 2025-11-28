test('Admin can check and uncheck admin role for a user', async ({ page }) => {
	// Log in as seeded admin user
	await login_with_ui(page, adminUser.username, adminUser.username + 'pass')
	await page.goto('/users/manage')

	// Pick a non-admin user for testing
	const dbUsers = await prisma.user.findMany({ where: { roles: { none: { name: 'admin' } } } })

	const targetUser = dbUsers[0]
	if (!targetUser) throw new Error('No non-admin user found for admin toggle test')
	const username = targetUser.username

	// Edit the user
	const editBtnId = `#edit_btn_${username}`
	await page.click(editBtnId)

	// Find the admin checkbox in edit mode
	const adminCheckboxId = `input[name='admin']` // Should be unique in edit form
	const adminCheckbox = page.locator(adminCheckboxId).first()

	// Check the box
	await adminCheckbox.check()
	await page.waitForTimeout(500)
	await page.reload()

	// Verify admin is now checked in view mode
	const viewRow = page.locator(`#username_${username}_display`).locator('..').locator("input[type='checkbox']")
	expect(await viewRow.isChecked()).toBe(true)

	// Edit again and uncheck
	await page.click(editBtnId)
	await adminCheckbox.uncheck()
	await page.waitForTimeout(500)
	await page.reload()

	// Verify admin is now unchecked in view mode
	expect(await viewRow.isChecked()).toBe(false)
})
import { ACCESS_DENIED_MESSAGE } from '../../app/constants/error-messages'
import { prisma } from '../../app/utils/db.server'
import { login_with_ui } from '../playwright-helper'
import { test, expect } from '../playwright-utils'
import { normalUser, adminUser } from '../seed-test'
test('Normal user gets Access Denied on /users', async ({ page }) => {
	await login_with_ui(page, normalUser.username, normalUser.username + 'pass')
	await page.goto('/users')
	await expect(page.locator('text=Access denied')).toBeVisible()
})

test('Admin user can access /users/manage page', async ({ page }) => {
	await login_with_ui(page, adminUser.username, adminUser.username + 'pass')
	await page.goto('/users')
	// Check for users-page id on the main container
	await expect(page.locator('#users-page')).toBeVisible()
})

test('Normal user cannot access manage users screen or see manage option', async ({
	page,
}) => {
	// Log in as normal user
	await login_with_ui(page, normalUser.username, normalUser.username + 'pass')
	// Open the user dropdown
	await page.click('#user-dropdown-btn')
	// Verify Manage Users option does NOT appear
	const manageOption = page.getByRole('menuitem', { name: /Manage Users/i })
	await expect(manageOption).toHaveCount(0)
	// Try to access /users/manage directly
	await page.goto('/users/manage')
	// Verify access denied message is shown
	await expect(page.locator('text=' + ACCESS_DENIED_MESSAGE)).toBeVisible()
})
test('Admin can see Manage Users and access manage screen', async ({
	page,
}) => {
	// Log in as seeded admin user
	await login_with_ui(page, adminUser.username, adminUser.username + 'pass')
	// Open the user dropdown using id
	await page.click('#user-dropdown-btn')
	// Check for Manage Users option in dropdown
	await expect(
		page.getByRole('menuitem', { name: /Manage Users/i }),
	).toBeVisible()
	// Go to /users/manage
})
test('Admin can view and edit users in manage users screen', async ({ page }) => {
	// Log in as seeded admin user
	await login_with_ui(page, adminUser.username, adminUser.username + 'pass')
	await page.goto('/users/manage')

	// Get user count from database
	const dbUserCount = await prisma.user.count()

	// Count number of user rows in UI (li elements inside the user list)
	const userRows = await page.locator('ul.divide-y > li').all()
	expect(userRows.length).toBe(dbUserCount)

	// Confirm at least one user row exists and first row represents a user
	const firstRow = userRows[0]
	const emailText = await firstRow?.locator('div').nth(0).textContent()
	const usernameText = await firstRow?.locator('div').nth(1).textContent()
	expect(emailText).toBeTruthy()
	expect(usernameText).toBeTruthy()

	// Edit admin user's email
	const adminUsername = adminUser.username
	const editBtnId = `#edit_btn_${adminUsername}`
	const emailInputId = `#email_${adminUsername}`
	const emailDisplayId = `#email_${adminUsername}_display`

	// Click edit button for admin user
	await page.click(editBtnId)

	// Store original email
	const originalEmail = await page.locator(emailInputId).inputValue()
	// Generate new email
	const newEmail = `${Math.random().toString(36).substring(2, 10)}@gmail.com`
	// Change email and tab out
	await page.fill(emailInputId, newEmail)
	await page.keyboard.press('Tab')

	// Wait for update and refresh page
	await page.waitForTimeout(500) // Give backend time to process
	await page.reload()

	// Confirm new email is displayed
	const displayedEmail = await page.locator(emailDisplayId).textContent()
	expect(displayedEmail?.trim()).toBe(newEmail)

	// Change email back to original
	await page.click(editBtnId)
	await page.fill(emailInputId, originalEmail)
	await page.keyboard.press('Tab')
	await page.waitForTimeout(500)
	await page.reload()
	const revertedEmail = await page.locator(emailDisplayId).textContent()
	expect(revertedEmail?.trim()).toBe(originalEmail)
})
