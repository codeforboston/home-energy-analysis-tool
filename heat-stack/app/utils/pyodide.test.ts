import { expect, test } from 'vitest'
import * as pyodideModule from 'pyodide'

/* For this to pass, you must run 
    `pushd ../rules-engine && python3 -m venv venv && source venv/bin/activate && pip install -q build && python3 -m build && popd` */

/* Referenced https://github.com/epicweb-dev/full-stack-testing/blob/main/exercises/04.unit-test/02.solution.spies/app/utils/misc.error-message.test.ts of https://www.epicweb.dev/workshops/web-application-testing*/
test('pyodide loads', async () => {
	const getPyodide = async () => {
		// public folder:
		return await pyodideModule.loadPyodide({
			indexURL: 'public/pyodide-env/',
		})
	}
	const runPythonScript = async () => {
		const pyodide: any = await getPyodide()
		// console.log(engine);
		await pyodide.loadPackage('numpy')
		await pyodide.loadPackage(
			'../rules-engine/dist/rules_engine-0.0.1-py3-none-any.whl',
		)
		return pyodide
	}
	// consider running https://github.com/codeforboston/home-energy-analysis-tool/blob/main/rules-engine/tests/test_rules_engine/test_engine.py
	const pyodide: any = await runPythonScript()
	const result = await pyodide.runPythonAsync(`
	from rules_engine import engine

	out = engine.hdd(57, 60)
	out`)
	expect(result).toBe(3)
})
