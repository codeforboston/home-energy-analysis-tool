import { useState, useEffect } from 'react';

import * as pyodideModule from 'pyodide'
import engine from '../../../rules-engine/src/rules_engine/engine.py';

const loadPyodide = async () => {
	const pyodide: any = await pyodideModule.loadPyodide({
		// public folder
		indexURL: 'pyodide-env/',
	})
	await pyodide.loadPackage("numpy")
	await pyodide.runPythonAsync(engine);
	return pyodide;
};

export function useRulesEngine(code: string){
	const [output, setOutput] = useState<string | null>('(loading python...)');

	useEffect(() => {
		const run = async () => {
			const pyodide: any = await loadPyodide();
			const result = await pyodide.runPythonAsync(code);
			setOutput(result);
		};
		run();
	}, []);
	
	return output;
}