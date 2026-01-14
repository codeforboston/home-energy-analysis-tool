import { ACCESS_DENIED_MESSAGE } from '../../app/constants/error-messages'
import { prisma } from '../../app/utils/db.server'
import { test, expect } from '../playwright-heat-utils'

test('Admin can check and uncheck admin role for a user', async ({
	page,
	insertAndLoginTemporaryUser,
	insertTemporaryUser,
}) => {
	// insertAndLoginTemporaryUser as admin user using fixture
	const loginUser = await insertAndLoginTemporaryUser({ is_admin: true })
	// Create a non-admin user for manipulation
	const otherUser = await insertTemporaryUser({ is_admin: false })
	const username = otherUser.username
	await page.goto('/users')

	// Edit the user
	const editBtnId = `#edit_btn_${username}`
	await page.click(editBtnId)

	// Find the admin checkbox in edit mode
	const adminCheckboxId = `input[name='admin']`
	const adminCheckbox = page.locator(adminCheckboxId).first()

	// Check the box
	await adminCheckbox.check()
	await page.waitForTimeout(500)
	await page.reload()

	// Verify admin is now checked in view mode
	const viewRow = page
		.locator(`#username_${username}_display`)
		.locator('..')
		.locator("input[type='checkbox']")
	expect(await viewRow.isChecked()).toBe(true)

	// Edit again and uncheck
	await page.click(editBtnId)
	await adminCheckbox.uncheck()
	await page.waitForTimeout(500)
	await page.reload()

	// Verify admin is now unchecked in view mode
	expect(await viewRow.isChecked()).toBe(false)
})

test('Admin user can see Users option', async ({
	page,
	insertAndLoginTemporaryUser,
}) => {
	await insertAndLoginTemporaryUser({ is_admin: true })
	await page.goto('/')
	// Find the Users link in the main nav (desktop and mobile)
	const usersLink = page.getByRole('link', { name: /^Users$/i })
	await expect(usersLink).toBeVisible()
	await usersLink.click()
	await expect(page).toHaveURL(/\/users$/)
})

test('Admin can view and edit users', async ({
	page,
	insertAndLoginTemporaryUser,
	insertTemporaryUser,
}) => {
	await insertAndLoginTemporaryUser({ is_admin: true })
	await insertTemporaryUser({ is_admin: false })
	await insertTemporaryUser({ is_admin: false })
	const otherUser = await insertTemporaryUser({ is_admin: false })
	await page.goto('/users')
	const dbUserCount = await prisma.user.count()
	const userRows = await page.locator('ul.divide-y > li').all()
	expect(userRows.length).toBe(dbUserCount)
	const firstRow = userRows[0]
	const emailText = await firstRow?.locator('div').nth(0).textContent()
	const usernameText = await firstRow?.locator('div').nth(1).textContent()
	expect(emailText).toBeTruthy()
	expect(usernameText).toBeTruthy()
	// Manipulate otherUser (not admin)
	const editBtnId = `#edit_btn_${otherUser.username}`

	const emailInputId = `#email_${otherUser.username}`
	const emailDisplayId = `#email_${otherUser.username}_display`
	await page.click(editBtnId)
	const originalEmail = await page.locator(emailInputId).inputValue()
	const newEmail = `${Math.random().toString(36).substring(2, 10)}@gmail.com`
	await page.fill(emailInputId, newEmail)
	await page.keyboard.press('Tab')
	await page.waitForTimeout(500)
	await page.reload()
	const displayedEmail = await page.locator(emailDisplayId).textContent()
	expect(displayedEmail?.trim()).toBe(newEmail)
	await page.click(editBtnId)
	await page.fill(emailInputId, originalEmail)
	await page.keyboard.press('Tab')
	await page.waitForTimeout(500)
	await page.reload()
	const revertedEmail = await page.locator(emailDisplayId).textContent()
	expect(revertedEmail?.trim()).toBe(originalEmail)
})

test('Normal user cannot see Users option', async ({
	page,
	insertAndLoginTemporaryUser,
}) => {
	await insertAndLoginTemporaryUser({ is_admin: false })
	await page.goto('/')
	const usersLink = page.getByRole('link', { name: /^Users$/i })
	await expect(usersLink).not.toBeVisible()
})

test('Normal user gets Access Denied on /users', async ({
	page,
	insertAndLoginTemporaryUser,
}) => {
	await insertAndLoginTemporaryUser({ is_admin: false })
	await page.goto('/users')
	await expect(page.locator('text=' + ACCESS_DENIED_MESSAGE)).toBeVisible()
})
