import { SummaryOutputSchema } from '../../../../../../../types/types'
import { COLOR_BLUE, COLOR_ORANGE } from '../constants'
import {
	calculateAvgHeatLoad,
	calculateMaxHeatLoad,
} from './heat-load-calculations'

type HeatLoadGraphPoint = {
	avgLine?: number
	maxLine?: number
	x: number
	avg?: number
	max?: number
	color?: string
}

/**
 * Calculate the heat load data points for max and avg lines.
 * The data is computed based on the provided heat load summary and the design temperature.
 * The returned data points are used for graphing the average and maximum heat load over a range of temperatures.
 *
 * @param {SummaryOutputSchema} heatLoadSummaryOutput - The heat load summary data.
 * @param {number} designSetPoint - The design temperature set point, typically 70°F.
 * @returns {HeatLoadGraphPoint[]} - An array of data points for the lines and scatter points, each containing a temperature and associated heat load values.
 */
export const buildHeatLoadGraphData = (
	heatLoadSummaryOutput: SummaryOutputSchema,
	designSetPoint: number,
): HeatLoadGraphPoint[] => {
	const { design_temperature } = heatLoadSummaryOutput
	const points: HeatLoadGraphPoint[] = []

	// Calculate heat load at -10°F from the design temperature (start point)
	const startTemperature = design_temperature - 10
	const avgHeatLoadStart = calculateAvgHeatLoad(
		heatLoadSummaryOutput,
		startTemperature,
		designSetPoint,
	)
	const maxHeatLoadStart = calculateMaxHeatLoad(
		heatLoadSummaryOutput,
		startTemperature,
		designSetPoint,
	)

	// Calculate heat load at design temperature
	const avgHeatLoad = calculateAvgHeatLoad(
		heatLoadSummaryOutput,
		design_temperature,
		designSetPoint,
	)
	const maxHeatLoad = calculateMaxHeatLoad(
		heatLoadSummaryOutput,
		design_temperature,
		designSetPoint,
	)

	// Calculate heat load at design set point (70°F)
	const endTemperature = designSetPoint
	const avgHeatLoadSetPoint = calculateAvgHeatLoad(
		heatLoadSummaryOutput,
		endTemperature,
		designSetPoint,
	)
	const maxHeatLoadSetPoint = calculateMaxHeatLoad(
		heatLoadSummaryOutput,
		endTemperature,
		designSetPoint,
	)

	// point for avg line at start
	points.push({
		x: startTemperature,
		avgLine: avgHeatLoadStart,
		color: COLOR_BLUE,
	})
	// point for avg line at design temperature
	points.push({
		x: design_temperature,
		avgLine: avgHeatLoad,
		avg: avgHeatLoad,
		color: COLOR_BLUE,
	})
	// point for avg line at design set point
	points.push({
		x: designSetPoint,
		avgLine: avgHeatLoadSetPoint,
		color: COLOR_BLUE,
	})

	// Add the point for max line at start temperature
	points.push({
		x: startTemperature,
		maxLine: maxHeatLoadStart,
		color: COLOR_ORANGE,
	})
	// Add the point for max line at design temperature
	points.push({
		x: design_temperature,
		maxLine: maxHeatLoad,
		max: maxHeatLoad,
		color: COLOR_ORANGE,
	})
	// Add the point for max line at design set point
	points.push({
		x: designSetPoint,
		maxLine: maxHeatLoadSetPoint,
		color: COLOR_ORANGE,
	})

	return points
}
