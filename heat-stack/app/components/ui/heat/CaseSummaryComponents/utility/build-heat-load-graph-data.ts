import { SummaryOutputSchema } from '../../../../../../types/types';
import {
	calculateAvgHeatLoad,
	calculateMaxHeatLoad,
} from './heat-load-calculations';

type HeatLoadGraphPoint = {
	temperature: number
	avgLine?: number
	avgPoint?: number
	maxLine?: number
	maxPoint?: number
};

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
	const { design_temperature } = heatLoadSummaryOutput;

	const startTemperature = design_temperature - 10; // Start line 10f below design temperature for clarity
	const endTemperature = designSetPoint;

	const avgHeatLoad = calculateAvgHeatLoad(
		heatLoadSummaryOutput,
		design_temperature,
		designSetPoint,
	);

	const maxHeatLoad = calculateMaxHeatLoad(
		heatLoadSummaryOutput,
		design_temperature,
		designSetPoint,
	);

	// Points for Avg line
	const avgLineStartPoint = {
		temperature: startTemperature,
		avgLine: calculateAvgHeatLoad(
			heatLoadSummaryOutput,
			startTemperature,
			designSetPoint,
		),
	};

	const avgLineDesignTemperaturePoint = {
		temperature: design_temperature,
		avgLine: avgHeatLoad,
		avgPoint: avgHeatLoad,
	};

	const avgLineEndPoint = {
		temperature: designSetPoint,
		avgLine: calculateAvgHeatLoad(
			heatLoadSummaryOutput,
			endTemperature,
			designSetPoint,
		),
	};

	// Points for Max line
	const maxLineStartPoint = {
		temperature: startTemperature,
		maxLine: calculateMaxHeatLoad(
			heatLoadSummaryOutput,
			startTemperature,
			designSetPoint,
		),
	};

	const maxLineDesignTemperaturePoint = {
		temperature: design_temperature,
		maxLine: maxHeatLoad,
		maxPoint: maxHeatLoad,
	};

	const maxLineEndPoint = {
		temperature: designSetPoint,
		maxLine: calculateMaxHeatLoad(
			heatLoadSummaryOutput,
			endTemperature,
			designSetPoint,
		),
	};

	return [
		avgLineStartPoint,
		avgLineDesignTemperaturePoint,
		avgLineEndPoint,
		maxLineStartPoint,
		maxLineDesignTemperaturePoint,
		maxLineEndPoint
	]
}
