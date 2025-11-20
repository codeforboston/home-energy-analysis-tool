import { test as base } from '@playwright/test'

type TestFixtures = {
	collectCoverage: () => Promise<void>
}

export const test = base.extend<TestFixtures>({
	collectCoverage: async ({ page }, use) => {
		// Enable coverage collection
		await page.coverage.startJSCoverage({
			resetOnNavigation: false,
		})

		await use(async () => {
			// Collect and save coverage
			const coverage = await page.coverage.stopJSCoverage()
			
			// Filter for only TSX files
			const tsxCoverage = coverage.filter(entry => 
				entry.url.includes('/app/') && 
				(entry.url.endsWith('.tsx') || entry.url.endsWith('.jsx'))
			)

			console.log('TSX Coverage collected for:', tsxCoverage.map(c => c.url))
		})
	},
})

export { expect } from '@playwright/test'