import { expect, test } from '#tests/playwright-utils.ts'
import { type Page as PlaywrightPage } from 'playwright'

const getAnalysisHeaderTextContent = async (page: PlaywrightPage) => {
	return await page.getByTestId('analysis-header').textContent()
}


test.setTimeout(120000)
test('Logged out user can upload CSV, toggle table row checkbox, expecting analysis header to adjust.', async ({ page, login }) => {
	// Visit the root
	await page.goto('/')

	// click the "demo data" link
	await page.getByText('Get Started (with Demo Data)').click()

	await page
		.getByLabel("Upload your energy billing company's bill.")
		.nth(0)
		.setInputFiles('tests/fixtures/csv/green_button_gas_bill_quateman_for_test.csv')

	await page.locator('button[name="intent"][value="upload"]').click()

	// Waits for the URL, continues as soon as the URL appears
	// and times out if 15 seconds have passed without the URL appearing
	await page.waitForURL('/single', { timeout: 15_000 });
	// await page.screenshot({ 
	// 	path: 'full-page.png',
	// 	fullPage: true 
	// 	})

	//Toggle table row checkbox, expecting "Analysis Header" text to change.
	// save the analysis header text before checkbox click
	const tableHeaderContentBeforeClick = await getAnalysisHeaderTextContent(page);
		
	// click the first checkbox and wait
	const checkbox = page.getByRole("checkbox").first();

	// Assert the un-checked state
	await expect(checkbox).not.toBeChecked();

	// Click the checkbox
	await checkbox.click();

	// Assert the checked state
	await expect(checkbox).toBeChecked();
	// save the analysis header text after checkbox click and wait
	const tableHeaderContentAfterClick = await getAnalysisHeaderTextContent(page);
	
	// expect not equal
	expect(tableHeaderContentAfterClick).not.toEqual(tableHeaderContentBeforeClick);
})