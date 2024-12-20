import { SummaryOutputSchema } from '../../../../../../types/types'
// Utility file for helper functions related to calculating heat load
// calculations are based on documentation found here: https://docs.google.com/document/d/16WlqY3ofq4xpalsfwRuYBWMbeUHfXRvbWU69xxVNCGM/edit?tab=t.0#heading=h.tl7o1hwvhavz

/**
 * Calculates the maximum heat load based on the given temperature and heat load summary.
 * The result is rounded to the nearest integer.
 *
 * @param {SummaryOutputSchema} heatLoadSummary - The summary data that includes heat loss rates.
 * @param {number} temperature - The current temperature to use in the calculation.
 * @param {number} [designSetPoint] - The design set point temperature.
 * @returns {number} - The calculated maximum heat load.
 */
export function calculateMaxHeatLoad(
	heatLoadSummary: SummaryOutputSchema,
	temperature: number,
	designSetPoint: number,
): number {
	const { whole_home_heat_loss_rate } = heatLoadSummary
	return Math.round(
		Math.max(0, (designSetPoint - temperature) * whole_home_heat_loss_rate),
	)
}

/**
 * Calculates the average heat load based on the given temperature and heat load summary.
 * The result is rounded to the nearest integer.
 *
 * @param {SummaryOutputSchema} heatLoadSummary - The summary data that includes heat loss rates and indoor temperature details.
 * @param {number} temperature - The current temperature to use in the calculation.
 * @param {number} [designSetPoint] - The design set point temperature.
 * @returns {number} - The calculated average heat load.
 */
export function calculateAvgHeatLoad(
	heatLoadSummary: SummaryOutputSchema,
	temperature: number,
	designSetPoint: number,
): number {
	const {
		whole_home_heat_loss_rate,
		average_indoor_temperature,
		estimated_balance_point,
	} = heatLoadSummary
	return Math.round(
		Math.max(
			0,
			(designSetPoint -
				average_indoor_temperature +
				estimated_balance_point -
				temperature) *
				whole_home_heat_loss_rate,
		),
	)
}
