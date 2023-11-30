import * as pyodideModule from 'pyodide'
import { expect, test } from 'vitest'

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

		/* NOTES for pyodide-core:
		      need to be a special version from the release page, no pure whl: https://github.com/pydantic/pydantic-core/pull/128
		      get it from https://github.com/pydantic/pydantic-core/releases e.g. https://github.com/pydantic/pydantic-core/releases/download/v2.14.5/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl
		*/
		await pyodide.loadPackage(
			'public/pyodide-env/pydantic_core-2.14.5-cp311-cp311-emscripten_3_1_32_wasm32.whl',
		)

		/* NOTES for pydantic, typing-extensions, annotated_types: 
		    pyodide should match pyodide-core somewhat. 
	        typing-extensions needs specific version per https://github.com/pyodide/pyodide/issues/4234#issuecomment-1771735148
			try getting it from 
			   - https://pypi.org/project/pydantic/#files
			   - https://pypi.org/project/typing-extensions/
			   - https://pypi.org/project/annotated-types/#files
		*/
		await pyodide.loadPackage(
			'public/pyodide-env/pydantic-2.5.2-py3-none-any.whl',
		)
		await pyodide.loadPackage(
			'public/pyodide-env/typing_extensions-4.8.0-py3-none-any.whl',
		)
		await pyodide.loadPackage(
			'public/pyodide-env/annotated_types-0.5.0-py3-none-any.whl',
		)

		/* NOTES FOR DEBUGGING new requirements.txt
		      and getting specific versions of pure whl */
		// the below works but uses the internet/pypi content delivery network rather than localhost.
		// await pyodide.loadPackage('micropip')
		// const micropip = await pyodide.pyimport('micropip')
		// await micropip.install([
		// 	'typing-extensions==4.8.0',
		// 	'pydantic_core==2.14.5',
		// 	'pydantic==2.5.2',
		// ])
		// await micropip.install(['annotated-types'])

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
}, 6000)
