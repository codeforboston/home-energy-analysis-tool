import { describe, expect, it } from 'vitest'
import { type SummaryOutputSchema } from '../../../../../../types/types.ts'
import { buildHeatLoadGraphData } from './build-heat-load-graph-data.ts'

describe('buildHeatLoadGraphData', () => {
	const mockHeatLoadSummaryOutput: SummaryOutputSchema = {
		design_temperature: 10,
		whole_home_heat_loss_rate: 100,
		average_indoor_temperature: 68,
		estimated_balance_point: 62,
		other_fuel_usage: 0,
		difference_between_ti_and_tbp: 6,
		standard_deviation_of_heat_loss_rate: 10,
		average_heat_load: 6000,
		maximum_heat_load: 6000,
	}

	it('should return correct number of data points', () => {
		const result = buildHeatLoadGraphData(
			mockHeatLoadSummaryOutput,
			-10, // startTemperature
			70,  // designSetPoint
			90   // endTemperature
		)

		expect(result).toHaveLength(6)
	})

	it('should calculate correct values for data points', () => {
		const result = buildHeatLoadGraphData(
			mockHeatLoadSummaryOutput,
			-10, // startTemperature
			70,  // designSetPoint
			90   // endTemperature
		)

		// Check avg line start point
		expect(result[0]!.temperature).toBe(-10)
		expect(result[0]!.avgLine).toBe(9400) // (70 - 68 + 62 - (-10)) * 100

		// Check avg line design temperature point
		expect(result[1]!.temperature).toBe(10) // design_temperature
		expect(result[1]!.avgLine).toBe(5400) // (70 - 68 + 62 - 10) * 100
		expect(result[1]!.avgPoint).toBe(5400)

		// Check avg line end point
		expect(result[2]!.temperature).toBe(64) // balance_point + designSetPoint - average_indoor_temperature
		expect(result[2]!.avgLine).toBe(0)

		// Check max line start point
		expect(result[3]!.temperature).toBe(-10)
		expect(result[3]!.maxLine).toBe(8000) // (70 - (-10)) * 100

		// Check max line design temperature point
		expect(result[4]!.temperature).toBe(10)
		expect(result[4]!.maxLine).toBe(6000) // (70 - 10) * 100
		expect(result[4]!.maxPoint).toBe(6000)

		// Check max line end point
		expect(result[5]!.temperature).toBe(70) // designSetPoint
		expect(result[5]!.maxLine).toBe(0) // (70 - 90) * 100, but using endTemperature in maxLine calculation
	})

	it('should handle different start and end temperatures', () => {
		const result = buildHeatLoadGraphData(
			mockHeatLoadSummaryOutput,
			0,   // startTemperature
			72,  // designSetPoint
			80   // endTemperature
		)

		expect(result[0]!.temperature).toBe(0)
		expect(result[0]!.avgLine).toBe(5600) // (72 - 68 + 62 - 0) * 100

		expect(result[3]!.temperature).toBe(0)
		expect(result[3]!.maxLine).toBe(7200) // (72 - 0) * 100

		expect(result[5]!.temperature).toBe(72) // designSetPoint
	})

	it('should handle zero heat loss rate', () => {
		const zeroHeatLossSummary = {
			...mockHeatLoadSummaryOutput,
			whole_home_heat_loss_rate: 0,
		}

		const result = buildHeatLoadGraphData(
			zeroHeatLossSummary,
			-10,
			70,
			90
		)

		// All heat load values should be 0
		expect(result[0]!.avgLine).toBe(0)
		expect(result[1]!.avgLine).toBe(0)
		expect(result[1]!.avgPoint).toBe(0)
		expect(result[3]!.maxLine).toBe(0)
		expect(result[4]!.maxLine).toBe(0)
		expect(result[4]!.maxPoint).toBe(0)
	})

	it('should handle extreme temperature values', () => {
		const result = buildHeatLoadGraphData(
			mockHeatLoadSummaryOutput,
			-50, // very cold start
			70,
			100  // very hot end
		)

		expect(result[0]!.temperature).toBe(-50)
		expect(result[0]!.avgLine).toBe(13400) // (70 - 68 + 62 - (-50)) * 100

		expect(result[3]!.temperature).toBe(-50)
		expect(result[3]!.maxLine).toBe(12000) // (70 - (-50)) * 100
	})

	it('should maintain proper data structure for all points', () => {
		const result = buildHeatLoadGraphData(
			mockHeatLoadSummaryOutput,
			-10,
			70,
			90
		)

		// Check that all points have temperature
		result.forEach(point => {
			expect(point).toHaveProperty('temperature')
			expect(typeof point.temperature).toBe('number')
		})

		// Check specific points have correct properties
		expect(result[0]!).toHaveProperty('avgLine')
		expect(result[0]!).not.toHaveProperty('avgPoint')

		expect(result[1]!).toHaveProperty('avgLine')
		expect(result[1]!).toHaveProperty('avgPoint')

		expect(result[2]!).toHaveProperty('avgLine')
		expect(result[2]!).not.toHaveProperty('avgPoint')

		expect(result[3]!).toHaveProperty('maxLine')
		expect(result[3]!).not.toHaveProperty('maxPoint')

		expect(result[4]!).toHaveProperty('maxLine')
		expect(result[4]!).toHaveProperty('maxPoint')

		expect(result[5]!).toHaveProperty('maxLine')
		expect(result[5]!).not.toHaveProperty('maxPoint')
	})
})