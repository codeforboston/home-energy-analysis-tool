import { prisma } from '#app/utils/db.server.ts'
import { expect, test } from '#tests/playwright-utils.ts'
import { createSampleCases } from '../create-case'

// Helper to login as admin or user
test.describe('Case list admin/user visibility', () => {
	test('Admin can see all cases and username column', async ({
		page,
		loginTemporary,
		insertTemporaryUser,
	}) => {
		// Login as regular user using helper
		const adminLoginUser = await loginTemporary({ is_admin: true })
		await createSampleCases(adminLoginUser, 3)
		const otherUser = await insertTemporaryUser({ is_admin: false })
		await createSampleCases(otherUser, 2)
		await page.waitForTimeout(2000)
		await page.goto('/cases')
		// After login, ensure we are not redirected to /login
		await expect(page).not.toHaveURL(/\/login/)
		// Get all rows
		const rows = await page.locator('table tbody tr')
		const rowCount = await rows.count()
		const dbCount = await prisma.case.count()

		expect(rowCount).toEqual(dbCount)

		// Check 'Username' column header appears
		const pageContent = await page.content()
		const hasUsernameColumn = /<th[^>]*>\s*Username\s*<\/th>/i.test(pageContent)
		expect(hasUsernameColumn).toBe(true)

		// Check normalUser.username appears as a standalone value between any HTML tags (e.g., <div>, <td>, etc.)
		const hasUsernameStandalone = new RegExp(
			`>\\s*${otherUser.username}\\s*<`,
			'i',
		).test(pageContent)
		expect(hasUsernameStandalone).toBe(true)
	})

	test('non-admin sees only own cases, no username column', async ({
		page,
		loginTemporary,
		insertTemporaryUser,
	}) => {
		// Login as regular user using helper
		const normalLoginUser = await loginTemporary({ is_admin: false })
		await createSampleCases(normalLoginUser, 4)
		const otherUser = await insertTemporaryUser({ is_admin: false })
		await createSampleCases(otherUser, 2)
		await page.waitForTimeout(2000)
		await page.goto('/cases')
		// Username column should NOT be visible
		const pageContent = await page.content()
		const hasUsernameColumn = /<th[^>]*>\s*Username\s*<\/th>/i.test(pageContent)
		expect(hasUsernameColumn).toBe(false)

		// Username value should NOT appear as a standalone cell
		const hasUsernameCell = new RegExp(
			`<td[^>]*>\s*${normalLoginUser.username}\s*<\/td>`,
			'i',
		).test(pageContent)
		expect(hasUsernameCell).toBe(false)
		// Get all rows
		const rows = await page.locator('table tbody tr')
		const rowCount = await rows.count()

		// Check row count matches DB case count for normalUser
		const normalLoginUserCaseCount = await prisma.case.count({
			where: {
				users: {
					some: { id: normalLoginUser.id },
				},
			},
		})
		expect(rowCount).toBe(normalLoginUserCaseCount)
		// For each row, check it is for the logged-in user
		for (let i = 0; i < rowCount; i++) {
			// For non-admin, home owner is always the 2nd cell (index 1)
			const homeOwnerCell = await rows.nth(i).locator('td').nth(1).textContent()
			expect(homeOwnerCell).toContain(normalLoginUser.username)
		}
	})
})
