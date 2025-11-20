import { describe, expect, it } from 'vitest'
import { type SummaryOutputSchema } from '../../../../../../types/types.ts'
import {
	calculateMaxHeatLoad,
	calculateAvgHeatLoad,
	calculateAvgHeatLoadEndPoint,
} from './heat-load-calculations.ts'

describe('heat-load-calculations', () => {
	describe('calculateMaxHeatLoad', () => {
		it('should calculate maximum heat load correctly', () => {
			const result = calculateMaxHeatLoad(100, 30, 70)
			expect(result).toBe(4000) // (70 - 30) * 100 = 4000
		})

		it('should return 0 when temperature is higher than design set point', () => {
			const result = calculateMaxHeatLoad(100, 80, 70)
			expect(result).toBe(0) // Math.max(0, (70 - 80) * 100) = 0
		})

		it('should handle zero heat loss rate', () => {
			const result = calculateMaxHeatLoad(0, 30, 70)
			expect(result).toBe(0)
		})

		it('should handle negative temperatures', () => {
			const result = calculateMaxHeatLoad(50, -10, 70)
			expect(result).toBe(4000) // (70 - (-10)) * 50 = 4000
		})
	})

	describe('calculateAvgHeatLoad', () => {
		const mockHeatLoadSummary: SummaryOutputSchema = {
			whole_home_heat_loss_rate: 100,
			average_indoor_temperature: 68,
			estimated_balance_point: 62,
			design_temperature: 10,
			other_fuel_usage: 0,
			difference_between_ti_and_tbp: 6,
			standard_deviation_of_heat_loss_rate: 10,
			average_heat_load: 6000,
			maximum_heat_load: 6000,
		}

		it('should calculate average heat load correctly', () => {
			const result = calculateAvgHeatLoad(mockHeatLoadSummary, 30, 70)
			// (70 - 68 + 62 - 30) * 100 = 3400
			expect(result).toBe(3400)
		})

		it('should return 0 when calculation results in negative value', () => {
			const result = calculateAvgHeatLoad(mockHeatLoadSummary, 80, 70)
			// (70 - 68 + 62 - 80) * 100 = -1600, but Math.max(0, -1600) = 0
			expect(result).toBe(0)
		})

		it('should handle different heat loss rates', () => {
			const customSummary = {
				...mockHeatLoadSummary,
				whole_home_heat_loss_rate: 200,
			}
			const result = calculateAvgHeatLoad(customSummary, 30, 70)
			// (70 - 68 + 62 - 30) * 200 = 6800
			expect(result).toBe(6800)
		})

		it('should handle zero heat loss rate', () => {
			const customSummary = {
				...mockHeatLoadSummary,
				whole_home_heat_loss_rate: 0,
			}
			const result = calculateAvgHeatLoad(customSummary, 30, 70)
			expect(result).toBe(0)
		})
	})

	describe('calculateAvgHeatLoadEndPoint', () => {
		it('should calculate average heat load endpoint correctly', () => {
			const result = calculateAvgHeatLoadEndPoint(62, 70, 68)
			expect(result).toBe(64) // 62 + 70 - 68 = 64
		})

		it('should handle negative values', () => {
			const result = calculateAvgHeatLoadEndPoint(50, 70, 80)
			expect(result).toBe(40) // 50 + 70 - 80 = 40
		})

		it('should handle zero values', () => {
			const result = calculateAvgHeatLoadEndPoint(0, 70, 70)
			expect(result).toBe(0) // 0 + 70 - 70 = 0
		})

		it('should handle decimal values', () => {
			const result = calculateAvgHeatLoadEndPoint(62.5, 70.2, 68.1)
			expect(result).toBeCloseTo(64.6) // 62.5 + 70.2 - 68.1 = 64.6
		})
	})
})
