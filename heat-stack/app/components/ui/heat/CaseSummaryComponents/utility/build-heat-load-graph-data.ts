import { SummaryOutputSchema } from '../../../../../../types/types';
import {
	calculateAvgHeatLoad,
	calculateAvgHeatLoadEndPoint,
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
	startTemperature: number,
	designSetPoint: number,
	endTemperature: number,
): HeatLoadGraphPoint[] => {
	const { design_temperature, whole_home_heat_loss_rate, average_indoor_temperature, estimated_balance_point } = heatLoadSummaryOutput;

	const avgHeatLoad = calculateAvgHeatLoad(
		heatLoadSummaryOutput,
		design_temperature,
		designSetPoint,
	);

	const maxHeatLoad = calculateMaxHeatLoad(
		whole_home_heat_loss_rate,
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
		temperature: calculateAvgHeatLoadEndPoint(estimated_balance_point, designSetPoint, average_indoor_temperature),
		avgLine: 0,
	};

	// Points for Max line
	const maxLineStartPoint = {
		temperature: startTemperature,
		maxLine: calculateMaxHeatLoad(
			whole_home_heat_loss_rate,
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
			whole_home_heat_loss_rate,
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
