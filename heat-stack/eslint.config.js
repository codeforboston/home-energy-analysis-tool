import { default as defaultConfig } from '@epic-web/config/eslint'

/** @type {import("eslint").Linter.Config} */
export default [
	{
		ignores: ['public/pyodide-env/**', 'public/build/**', 'build/index.js']
	  },
	...defaultConfig,
	// add custom config objects here:
	{
		files: ['**/tests/**/*.ts'],
		rules: { 
			'react-hooks/rules-of-hooks': 'off' ,
			'no-unused-vars': 'off', // Turn off the base rule
			'@typescript-eslint/no-unused-vars': 'off'
		},
	},
	{
		ignores: ['.react-router/*'],
	},
]
