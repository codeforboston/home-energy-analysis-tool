import { type Page as PlaywrightPage } from 'playwright'
import { expect, test as base } from '#tests/playwright-utils.ts'

const getAnalysisHeaderTextContent = async (page: PlaywrightPage) => {
	return await page.getByTestId('analysis-header').textContent()
}

type TestFixtures = {
	uploadEnergyBill: (filename?: string) => Promise<void>
}

const test = base.extend<TestFixtures>({
	uploadEnergyBill: async ({ page }, use) => {
		const uploadFile = async (
			filepath: string = 'tests/fixtures/csv/green_button_gas_bill_quateman_for_test.csv',
		) => {
			await page.getByTestId('upload-billing').nth(0).setInputFiles(filepath)

			await page.locator('button[name="intent"][value="upload"]').click()

			// Waits for the URL, continues as soon as the URL appears
			// and times out if 15 seconds have passed without the URL appearing
			await page.waitForURL('/single', { timeout: 15_000 })
		}

		await use(uploadFile)
	},
})

test.setTimeout(120000)
test.describe('Logged out user interacting with demo form and energy bill uploads', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
		await page.getByText('Get Started (with Demo Data)').click()
	})

	test('Uploads a CSV and sees table render and analysis header', async ({
		page,
		uploadEnergyBill,
	}) => {
		await uploadEnergyBill()

		// TODO Update analysisHeader assertion to validate values instead of existence

		// test analysis header exists
		const headerContent = await getAnalysisHeaderTextContent(page)
		expect(headerContent).not.toBe('')

		// test table exists
		const table = page.getByTestId('EnergyUseHistoryChart')
		const numOfRows = await table.locator('tr').count()
		expect(numOfRows).toBe(26)
	})

	test('Toggle table row checkbox, expecting "Analysis Header" text to change', async ({
		page,
		uploadEnergyBill,
	}) => {
		await uploadEnergyBill()

		const checkbox = page.locator('[role="checkbox"]').first()

		// Save the analysis header text before checkbox click
		const defaultHeaderText = await getAnalysisHeaderTextContent(page)

		// Validate checkbox "on" works
		await expect(checkbox).not.toBeChecked()
		await checkbox.click()
		await expect(checkbox).toBeChecked()

		// Get analysis header text after checkbox toggled
		const headerTextAfterCheckboxOn = await getAnalysisHeaderTextContent(page)
		expect(headerTextAfterCheckboxOn).not.toEqual(defaultHeaderText)

		// Validate checkbox "off" works
		await checkbox.click()
		await expect(checkbox).not.toBeChecked()

		// Validate turning checkbox "off" brings back the original header text
		const headerTextAfterCheckboxOff = await getAnalysisHeaderTextContent(page)
		expect(headerTextAfterCheckboxOff).toEqual(defaultHeaderText)
	})

	test('Upload multiple CSVs', async ({ page, uploadEnergyBill }) => {
		await uploadEnergyBill()

		const headerForOriginalCsvUpload = await getAnalysisHeaderTextContent(page)

		await uploadEnergyBill('tests/fixtures/csv/natural-gas-eversource.csv')
		// This is a hack to check if table has updated.
		// First submit, uploadEnergyBill() will wait for url to change from /single?dev=true to /single
		// but in a scenario where we are uploading multiple times, the url will be /single
		// the poll checks that the table row count has updated to reflect the new csv data
		const table = page.getByTestId('EnergyUseHistoryChart')

		await expect
			.poll(
				async () => {
					return await table.locator('tr').count()
				},
				{
					message: 'Waiting for table to have 37 rows',
				},
			)
			.toBe(37)
		// await page.screenshot({
		// 	fullPage: true,
		// 	path: 'multi-submit-test.png',
		// })

		const headerForSecondCsvUpload = await getAnalysisHeaderTextContent(page)
		expect(headerForSecondCsvUpload).not.toEqual(headerForOriginalCsvUpload)
	})
})
