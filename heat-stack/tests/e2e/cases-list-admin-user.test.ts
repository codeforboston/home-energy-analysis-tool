

import { test, expect } from '@playwright/test'
import { login_with_ui } from '../playwright-helper'
import { adminUser, normalUser } from '../seed-test'
import { prisma } from '#app/utils/db.server.ts'

// Helper to login as admin or user
test.describe('Case list admin/user visibility', () => {

  	test('Admin can see all cases and username column', async ({
			page,
		}) => {
			// Login as regular user using helper
			await login_with_ui(page, adminUser.username, adminUser.username + 'pass')
			await page.goto('/cases')
			// After login, ensure we are not redirected to /login
			await expect(page).not.toHaveURL(/\/login/)
			// Get all rows
			const rows = await page.locator('table tbody tr')
			const rowCount = await rows.count()
			const dbCount = await prisma.case.count()

			expect(rowCount).toEqual(dbCount)

			// Check 'Username' appears somewhere in the page
			const pageContent = await page.content()
			expect(pageContent).toContain('Username')

			// Check normalUser.username appears somewhere in the page
			expect(pageContent).toContain(normalUser.username)

			console.log('rowCount', rowCount)
		})


	test('non-admin sees only own cases, no username column', async ({
		page,
	}) => {
		// Login as regular user using helper
		await login_with_ui(page, normalUser.username, normalUser.username + 'pass')
		await page.goto('/cases')
		// Username column should NOT be visible
		await expect(
			page.getByRole('columnheader', { name: /username/i }),
		).not.toBeVisible()
		// Get all rows
		const rows = await page.locator('table tbody tr')
		const rowCount = await rows.count()

		// Check row count matches DB case count for normalUser
		const dbCaseCount = await prisma.case.count({
			where: {
				users: {
					some: { id: normalUser.id },
				},
			},
		})
		expect(rowCount).toBe(dbCaseCount)
		// For each row, check it is for the logged-in user
		for (let i = 0; i < rowCount; i++) {
			// For non-admin, home owner is always the 2nd cell (index 1)
			const homeOwnerCell = await rows.nth(i).locator('td').nth(1).textContent()
			console.log('Checking row', i, homeOwnerCell)
			expect(homeOwnerCell).toContain(normalUser.username)
		}
	})
})
