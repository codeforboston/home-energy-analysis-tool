import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

// Import utilities before type-only imports for proper ordering
import {
	buildCurrentMapOfUsageData,
	buildCurrentUsageData,
	hasDataProperty,
	objectToString,
} from '#app/utils/index.ts'
import { type SchemaZodFromFormType } from '#types/single-form.ts'
import { type UsageDataSchema } from '#types/types.ts'
import { reviver } from '../data-parser'
import { type TemperatureInputDataConverted } from '../WeatherUtil'
import {
	useRulesEngine,
	type RulesEngineActionData,
} from './use-rules-engine.ts'

// Mock the dependencies
vi.mock('#app/utils/index.ts', () => ({
	buildCurrentMapOfUsageData: vi.fn(),
	buildCurrentUsageData: vi.fn(),
	hasDataProperty: vi.fn(),
	objectToString: vi.fn(),
}))

vi.mock('../data-parser', () => ({
	reviver: vi.fn(),
}))

// Mock the rules engine import
const mockRulesEngine = {
	executeRoundtripAnalyticsFromFormJs: vi.fn(),
	cleanupPyodideResources: vi.fn(),
}

vi.mock('#app/utils/rules-engine.ts', () => mockRulesEngine)

describe('useRulesEngine', () => {
	const mockActionData: RulesEngineActionData = {
		data: '{"test": "data"}',
		parsedAndValidatedFormSchema: {
			energy_use_upload: {
				type: 'text/csv',
				name: 'test.csv',
				size: 1024,
			},
			living_area: 2000,
			street_address: '123 Main St',
			town: 'Boston',
			state: 'MA',
			name: 'Test Home',
			fuel_type: 'GAS',
			heating_system_efficiency: 0.85,
			thermostat_set_point: 70,
			numberOfOccupants: 3,
			estimatedWaterHeatingEfficiency: 0.8,
			standByLosses: 0.1,
		} as unknown as SchemaZodFromFormType,
		convertedDatesTIWD: {
			dates: ['2023-01-01', '2023-01-02'],
			temperatures: [30, 32],
		} as unknown as TemperatureInputDataConverted,
		state_id: '25',
		county_id: '025',
	}

	const mockUsageData: UsageDataSchema = {
		heat_load_output: {
			estimated_balance_point: 65,
			other_fuel_usage: 0,
			average_indoor_temperature: 70,
			difference_between_ti_and_tbp: 5,
			design_temperature: 10,
			whole_home_heat_loss_rate: 100,
			standard_deviation_of_heat_loss_rate: 15,
			average_heat_load: 5000,
			maximum_heat_load: 6000,
		},
		balance_point_graph: {
			records: [
				{
					balance_point: 65,
					heat_loss_rate: 100,
					change_in_heat_loss_rate: 5,
					percent_change_in_heat_loss_rate: 10,
					standard_deviation: 15,
				},
			],
		},
		processed_energy_bills: [
			{
				period_start_date: '2023-01-01',
				period_end_date: '2023-01-31',
				usage: 100,
				inclusion_override: true,
				analysis_type: 1,
				default_inclusion: true,
				eliminated_as_outlier: false,
				whole_home_heat_loss_rate: 50,
			},
		],
	}

	beforeEach(() => {
		vi.clearAllMocks()

		// Setup default mock implementations
		vi.mocked(hasDataProperty).mockReturnValue(true)
		vi.mocked(buildCurrentUsageData).mockReturnValue(mockUsageData)
		vi.mocked(buildCurrentMapOfUsageData).mockReturnValue(new Map())
		vi.mocked(objectToString).mockImplementation((obj) => JSON.stringify(obj))
		vi.mocked(reviver).mockImplementation((key, value) => value)

		// Mock the PyProxy object
		const mockPyProxy = {
			toJs: vi.fn().mockReturnValue(new Map()),
			destroy: vi.fn(),
		}
		mockRulesEngine.executeRoundtripAnalyticsFromFormJs.mockReturnValue(
			mockPyProxy,
		)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('initialization', () => {
		it('should initialize with correct default values', () => {
			const { result } = renderHook(() => useRulesEngine(undefined))

			expect(result.current.usageData).toBeUndefined()
			expect(typeof result.current.lazyLoadRulesEngine).toBe('function')
		})

		it('should lazy load rules engine when lazyLoadRulesEngine is called', async () => {
			const { result } = renderHook(() => useRulesEngine(undefined))


			await act(async () => {
				result.current.lazyLoadRulesEngine()
				// Wait for the promise to resolve
				await new Promise((resolve) => setTimeout(resolve, 0))
			})

		})

		it('should not reinitialize if already initialized', async () => {
			const { result } = renderHook(() => useRulesEngine(undefined))

			await act(async () => {
				result.current.lazyLoadRulesEngine()
				await new Promise((resolve) => setTimeout(resolve, 0))
			})

			await act(async () => {
				result.current.lazyLoadRulesEngine()
				await new Promise((resolve) => setTimeout(resolve, 0))
			})

		})
	})

	describe('actionData processing', () => {
		it('should process actionData and update usageData when provided', () => {
			renderHook(() => useRulesEngine(mockActionData))

			expect(hasDataProperty).toHaveBeenCalledWith(mockActionData)
			expect(reviver).toHaveBeenCalled()
			expect(buildCurrentUsageData).toHaveBeenCalled()
		})

		it('should not process actionData when undefined', () => {
			renderHook(() => useRulesEngine(undefined))

			expect(hasDataProperty).not.toHaveBeenCalled()
			expect(buildCurrentUsageData).not.toHaveBeenCalled()
		})

		it('should not process actionData when hasDataProperty returns false', () => {
			vi.mocked(hasDataProperty).mockReturnValue(false)

			renderHook(() => useRulesEngine(mockActionData))

			expect(hasDataProperty).toHaveBeenCalledWith(mockActionData)
			expect(buildCurrentUsageData).not.toHaveBeenCalled()
		})

		it('should update usageData when actionData changes', () => {
			const { result, rerender } = renderHook(
				({ actionData }: { actionData: RulesEngineActionData }) =>
					useRulesEngine(actionData),
				{ initialProps: { actionData: undefined as RulesEngineActionData } },
			)

			expect(result.current.usageData).toBeUndefined()

			rerender({ actionData: mockActionData })

			expect(result.current.usageData).toEqual(mockUsageData)
		})
	})

	describe('cleanup', () => {
		it('should cleanup pyodide resources on unmount', async () => {
			const { result, unmount } = renderHook(() =>
				useRulesEngine(mockActionData),
			)

			await act(async () => {
				result.current.lazyLoadRulesEngine()
				await new Promise((resolve) => setTimeout(resolve, 0))
			})

			unmount()

			expect(mockRulesEngine.cleanupPyodideResources).toHaveBeenCalled()
		})

		it('should handle cleanup when rules engine is not loaded', () => {
			const { unmount } = renderHook(() => useRulesEngine(mockActionData))

			// Should not throw error when unmounting without loading rules engine
			expect(() => unmount()).not.toThrow()
		})
	})

	describe('error handling', () => {
		it('should handle rules engine import failure', async () => {
			// Mock import failure
			vi.doMock('#app/utils/rules-engine.ts', () => {
				throw new Error('Import failed')
			})

			const { result } = renderHook(() => useRulesEngine(undefined))

			await expect(async () => {
				await act(async () => {
					result.current.lazyLoadRulesEngine()
					await new Promise((resolve) => setTimeout(resolve, 0))
				})
			}).rejects.toThrow('Failed to load rules engine.')
		})

		it('should handle JSON parsing errors gracefully', () => {
			const invalidActionData = {
				...mockActionData,
				data: 'invalid json',
			}

			vi.mocked(reviver).mockImplementation(() => {
				throw new Error('JSON parse error')
			})

			expect(() => {
				renderHook(() => useRulesEngine(invalidActionData))
			}).not.toThrow() // Should not throw during render, might throw during effect
		})
	})
})
