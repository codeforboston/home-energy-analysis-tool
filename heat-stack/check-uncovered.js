import fs from 'fs'

const coverage = JSON.parse(
	fs.readFileSync('coverage/coverage-final.json', 'utf8'),
)

const uncoveredTsFiles = []
for (const [filePath, data] of Object.entries(coverage)) {
	// Only look at TS files (not TSX, not test files, not server files)
	if (
		filePath.endsWith('.ts') &&
		!filePath.includes('.test.') &&
		!filePath.includes('.server.') &&
		!filePath.includes('entry.') &&
		!filePath.includes('routes.ts')
	) {
		const statements = data.s || {}
		if (
			Object.keys(statements).length > 0 &&
			Object.values(statements).every((count) => count === 0)
		) {
			const relativePath = filePath.replace(
				'/Users/ethanadmin/projects/home-energy-analysis-tool/heat-stack/',
				'',
			)
			uncoveredTsFiles.push(relativePath)
		}
	}
}

console.log('TS files needing tests:')
console.log('======================')
uncoveredTsFiles.sort().forEach((file) => console.log('  ' + file))
console.log('')
console.log('Total files needing tests:', uncoveredTsFiles.length)
