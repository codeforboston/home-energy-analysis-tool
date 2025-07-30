import { faker } from '@faker-js/faker'
import { type NoteImage, type Note } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'
import { expect, test } from '#tests/playwright-utils.ts'
test.setTimeout(120000)
test('Logged out user can upload CSV, toggle table row checkbox, expecting analysis header to adjust.', async ({ page, login }) => {
	// Visit the root
	await page.goto('/')

	// click the "demo data" link
	await page.getByText('Get Started (with Demo Data)').click()
	await expect(page).toHaveURL(`/single?dev=true`)

	await page
		.getByLabel("Upload your energy billing company's bill.")
		.nth(0)
		.setInputFiles('tests/fixtures/csv/green_button_gas_bill_quateman_for_test.csv')

	await page.locator('button[name="intent"][value="upload"]').click()
	await page.waitForTimeout(15000) 
	// await page.screenshot({ 
	// 	path: 'full-page.png',
	// 	fullPage: true 
	// 	})
	await expect(page).toHaveURL(`/single`)

	//Toggle table row checkbox, expecting "Analysis Header" text to change.
	// save the analysis header text before checkbox click
	const analysisHeader_beforeClick = page.getByTestId("analysis-header").toString()
	// click the first checkbox and wait
	await page.locator('[role="checkbox"]').first().click();
	await page.waitForTimeout(15000) 
	// save the analysis header text after checkbox click and wait
	const analysisHeader_afterClick = page.getByTestId("analysis-header").toString()
	// expect not equal
	expect(analysisHeader_afterClick).not.toEqual(analysisHeader_beforeClick)
})