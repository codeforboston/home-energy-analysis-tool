import fs from 'fs'

try {
	const coverage = JSON.parse(
		fs.readFileSync('coverage/coverage-final.json', 'utf8'),
	)

	const coveredTsxFiles = []
	for (const [filePath, data] of Object.entries(coverage)) {
		if (filePath.endsWith('.tsx') && !filePath.includes('.test.')) {
			const statements = data.s || {}
			const hasNonZeroCoverage = Object.values(statements).some(
				(count) => count > 0,
			)
			if (hasNonZeroCoverage) {
				const relativePath = filePath.replace(
					'/Users/ethanadmin/projects/home-energy-analysis-tool/heat-stack/',
					'',
				)
				coveredTsxFiles.push(relativePath)
			}
		}
	}

	console.log('TSX files with unit test coverage:')
	console.log('==================================')
	coveredTsxFiles.sort().forEach((file) => console.log('  ' + file))
	console.log('')
	console.log('Total TSX files with coverage:', coveredTsxFiles.length)
} catch (e) {
	console.log('Error:', e.message)
}
