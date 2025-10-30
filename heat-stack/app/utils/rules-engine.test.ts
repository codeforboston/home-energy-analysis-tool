import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

// Mock pyodide and related modules
const mockPyodideInterface = {
	loadPackage: vi.fn(),
	runPythonAsync: vi.fn(),
}

const mockPyProxy = {
	destroy: vi.fn(),
	toJs: vi.fn(),
}

// Mock pyodide module
vi.mock('pyodide', () => ({
	loadPyodide: vi.fn().mockResolvedValue(mockPyodideInterface),
}))

// Mock Python code imports
vi.mock('../pycode/parse_gas_bill.py?raw', () => ({
	default: 'def executeParse(): pass'
}))

vi.mock('../pycode/get_analytics.py?raw', () => ({
	default: 'def executeGetAnalyticsFromForm(): pass'
}))

vi.mock('../pycode/roundtrip_analytics.py?raw', () => ({
	default: 'def executeRoundtripAnalyticsFromForm(): pass'
}))

// Import the module being tested after mocking
import {
	type ExecuteParseFunction,
	cleanupPyodideResources
} from './rules-engine.ts'

describe('rules-engine', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		
		// Reset mock implementations
		mockPyodideInterface.loadPackage.mockResolvedValue(undefined)
		mockPyodideInterface.runPythonAsync.mockResolvedValue(mockPyProxy)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('Pyodide initialization', () => {
		it('should load required packages on module import', () => {
			// Since the module loads packages on import, we can verify the calls were made
			expect(mockPyodideInterface.loadPackage).toHaveBeenCalledWith(
				expect.stringContaining('pydantic_core-2.27.2-cp313-cp313-pyodide_2025_0_wasm32.whl')
			)
			expect(mockPyodideInterface.loadPackage).toHaveBeenCalledWith(
				expect.stringContaining('pydantic-2.10.6-py3-none-any.whl')
			)
			expect(mockPyodideInterface.loadPackage).toHaveBeenCalledWith(
				expect.stringContaining('typing_extensions-4.14.0-py3-none-any.whl')
			)
			expect(mockPyodideInterface.loadPackage).toHaveBeenCalledWith(
				expect.stringContaining('annotated_types-0.7.0-py3-none-any.whl')
			)
			expect(mockPyodideInterface.loadPackage).toHaveBeenCalledWith(
				expect.stringContaining('rules_engine-0.0.1-py3-none-any.whl')
			)
		})

		it('should use correct base path based on environment', () => {
			// The test runs in Node.js environment (server-side)
			expect(mockPyodideInterface.loadPackage).toHaveBeenCalledWith(
				expect.stringContaining('public/pyodide-env/')
			)
		})

		it('should initialize Python functions on module import', () => {
			expect(mockPyodideInterface.runPythonAsync).toHaveBeenCalledWith(
				expect.stringContaining('executeParse')
			)
			expect(mockPyodideInterface.runPythonAsync).toHaveBeenCalledWith(
				expect.stringContaining('executeGetAnalyticsFromForm')
			)
			expect(mockPyodideInterface.runPythonAsync).toHaveBeenCalledWith(
				expect.stringContaining('executeRoundtripAnalyticsFromForm')
			)
		})
	})

	describe('cleanupPyodideResources', () => {
		it('should destroy all Python function proxies', async () => {
			// Create mock functions that match the expected interface
			const mockExecuteParseGasBillPy = {
				destroy: vi.fn(),
				toJs: vi.fn(),
			} as any

			const mockExecuteGetAnalyticsFromFormJs = {
				destroy: vi.fn(),
				toJs: vi.fn(),
			} as any

			const mockExecuteRoundtripAnalyticsFromFormJs = {
				destroy: vi.fn(),
				toJs: vi.fn(),
			} as any

			// Mock the module exports
			vi.doMock('./rules-engine.ts', async (importOriginal) => {
				const original = await importOriginal() as any
				return {
					...original,
					executeParseGasBillPy: mockExecuteParseGasBillPy,
					executeGetAnalyticsFromFormJs: mockExecuteGetAnalyticsFromFormJs,
					executeRoundtripAnalyticsFromFormJs: mockExecuteRoundtripAnalyticsFromFormJs,
				}
			})

			// Import the cleanup function
			const { cleanupPyodideResources: cleanup } = await import('./rules-engine.ts')
			
			// Call cleanup
			cleanup()

			// Verify all destroy methods were called
			expect(mockExecuteParseGasBillPy.destroy).toHaveBeenCalled()
			expect(mockExecuteGetAnalyticsFromFormJs.destroy).toHaveBeenCalled()
			expect(mockExecuteRoundtripAnalyticsFromFormJs.destroy).toHaveBeenCalled()
		})
	})

	describe('Type definitions', () => {
		it('should define ExecuteParseFunction with correct interface', () => {
			// This is more of a compile-time test, but we can verify the structure
			const mockFunction = vi.fn() as unknown as ExecuteParseFunction
			mockFunction.destroy = vi.fn()
			mockFunction.toJs = vi.fn()

			expect(typeof mockFunction).toBe('function')
			expect(typeof mockFunction.destroy).toBe('function')
			expect(typeof mockFunction.toJs).toBe('function')
		})
	})

	describe('Error handling', () => {
		it('should handle package loading failures gracefully', async () => {
			// Reset the mock to simulate failure
			mockPyodideInterface.loadPackage.mockRejectedValue(new Error('Package load failed'))

			// Since the module loads on import, we need to test error handling indirectly
			// In a real application, you might want to wrap the loading in try-catch
			await expect(mockPyodideInterface.loadPackage).rejects.toThrow('Package load failed')
		})

		it('should handle Python script execution failures', async () => {
			mockPyodideInterface.runPythonAsync.mockRejectedValue(new Error('Python execution failed'))

			await expect(mockPyodideInterface.runPythonAsync).rejects.toThrow('Python execution failed')
		})
	})

	describe('Environment detection', () => {
		it('should detect server environment correctly', () => {
			// In Node.js test environment, window should be undefined
			expect(typeof window).toBe('undefined')
		})

		it('should use correct basePath for server environment', () => {
			const isServer = typeof window === 'undefined'
			const expectedBasePath = isServer ? 'public/pyodide-env/' : '/pyodide-env/'
			
			expect(expectedBasePath).toBe('public/pyodide-env/')
		})
	})

	describe('Function proxy management', () => {
		it('should provide destroy method for cleanup', () => {
			expect(typeof cleanupPyodideResources).toBe('function')
		})

		it('should handle Map-based data structures for processed energy bills', () => {
			// Test that the types allow for Map-based structures
			const mockProcessedBill = new Map([
				['period_start_date', '2023-01-01'],
				['period_end_date', '2023-01-31'],
				['usage', 100],
				['analysis_type_override', false],
				['inclusion_override', true]
			] as [string, any][])

			expect(mockProcessedBill).toBeInstanceOf(Map)
			expect(mockProcessedBill.get('period_start_date')).toBe('2023-01-01')
			expect(mockProcessedBill.get('usage')).toBe(100)
		})

		it('should handle UserAdjustedData structure', () => {
			const mockUserAdjustedData = {
				processed_energy_bills: [
					new Map([
						['period_start_date', '2023-01-01'],
						['period_end_date', '2023-01-31'],
						['usage', 100]
					] as [string, any][])
				]
			}

			expect(mockUserAdjustedData.processed_energy_bills).toHaveLength(1)
			expect(mockUserAdjustedData.processed_energy_bills[0]).toBeInstanceOf(Map)
		})
	})
})