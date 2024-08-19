import { default as defaultConfig } from '@epic-web/config/eslint'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import typescriptEslintParser from '@typescript-eslint/parser'

/** @type {import("eslint").Linter.Config} */
export default [
	{
		ignores: ['public/pyodide-env/**', 'public/build/**', 'build/index.js']
	  },
	...defaultConfig,
	// add custom config objects here:
	{
		rules: {
			'no-unused-vars': 'off', // Turn off the base rule
			'@typescript-eslint/no-unused-vars': 'off'
		  },
		plugins: {
			'@typescript-eslint': typescriptEslintPlugin
		  },
		languageOptions: {
			parser: typescriptEslintParser
		  },

	  }
]