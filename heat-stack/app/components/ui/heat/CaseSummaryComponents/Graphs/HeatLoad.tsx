import React, { useMemo } from 'react'
import {
	ComposedChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	Label,
	Scatter,
} from 'recharts'
import { SummaryOutputSchema } from '../../../../../../types/types'

// Constants for chart styling
const COLOR_ORANGE = '#FF5733'
const COLOR_BLUE = '#8884d8'
const COLOR_GREY_LIGHT = '#f5f5f5'
const COLOR_WHITE = '#fff'

// Props interface defining expected input structure for HeatLoad component
interface HeatLoadProps {
	heatLoadSummaryOutput: SummaryOutputSchema
}

/**
 * HeatLoad component renders a chart that displays the heating system demand based on different temperature values.
 * The chart includes two lines representing maximum and average heat load, along with scatter points at design temperatures.
 * @param {HeatLoadProps} props - The props containing the heat load data to render the chart.
 * @returns {JSX.Element} - The rendered chart component.
 */
export function HeatLoad({ heatLoadSummaryOutput }: HeatLoadProps) {
	const designSetPoint = 70 // Design set point is 70°F as described in this document: https://docs.google.com/document/d/16WlqY3ofq4xpalsfwRuYBWMbeUHfXRvbWU69xxVNCGM/edit?tab=t.0
	const {
		whole_home_heat_loss_rate,
		average_indoor_temperature,
		estimated_balance_point,
		design_temperature,
	} = heatLoadSummaryOutput

	/**
	 * useMemo hook to calculate the heat load data points for max and avg lines.
	 * The data is computed based on the provided heat load summary and the design temperature
	 * using the calculations provided in this document: https://docs.google.com/document/d/16WlqY3ofq4xpalsfwRuYBWMbeUHfXRvbWU69xxVNCGM/edit?tab=t.0
	 * @returns {Array} - An array of data points for the lines and scatter points.
	 */
	const data = useMemo(() => {
		const points = []

		const getMaxHeatLoadForTemperature = (temperature: number) =>
			Math.max(0, (designSetPoint - temperature) * whole_home_heat_loss_rate)
		const getAvgHeatLoadForTemperature = (temperature: number) =>
			Math.max(
				0,
				(designSetPoint -
					average_indoor_temperature +
					estimated_balance_point -
					temperature) *
					whole_home_heat_loss_rate,
			)

		// Calculate heat load at -10°F from the design temperature (start point)
		const startTemperature = design_temperature - 10
		const avgHeatLoadStart = getAvgHeatLoadForTemperature(startTemperature)
		const maxHeatLoadStart = getMaxHeatLoadForTemperature(startTemperature)

		// Calculate heat load at design temperature
		const avgHeatLoad = getAvgHeatLoadForTemperature(design_temperature)
		const maxHeatLoad = getMaxHeatLoadForTemperature(design_temperature)

		// Calculate heat load at design set point (70°F)
		const avgHeatLoadSetPoint = getAvgHeatLoadForTemperature(designSetPoint)
		const maxHeatLoadSetPoint = getMaxHeatLoadForTemperature(designSetPoint)

		// Points for the average line
		points.push({
			temperature: startTemperature,
			avgLine: avgHeatLoadStart,
		})
		points.push({
			temperature: design_temperature,
			avgLine: avgHeatLoad,
			avgPoint: avgHeatLoad, // Add the point for avg line at design temperature
		})
		points.push({
			temperature: designSetPoint,
			avgLine: avgHeatLoadSetPoint,
		})

		// Points for the max line
		points.push({
			temperature: startTemperature,
			maxLine: maxHeatLoadStart,
		})
		points.push({
			temperature: design_temperature,
			maxLine: maxHeatLoad,
			maxPoint: maxHeatLoad, // Add the point for max line at design temperature
		})
		points.push({
			temperature: designSetPoint,
			maxLine: maxHeatLoadSetPoint,
		})

		return points
	}, [heatLoadSummaryOutput])

	/**
	 * useMemo hook to calculate the minimum Y-axis value based on the data.
	 * It includes a buffer to ensure the chart has some space below the minimum heat load value.
	 * @returns {number} - The calculated minimum Y-axis value.
	 */
	const minYValue = useMemo(() => {
		const minValue = Math.min(
			...data.map((point) =>
				Math.min(point.maxLine || Infinity, point.avgLine || Infinity),
			),
		)
		return Math.max(0, Math.floor((minValue * 0.8) / 10000) * 10000) // Add 20% buffer below min Y value
	}, [data])

	/**
	 * useMemo hook to calculate the maximum Y-axis value based on the data.
	 * It includes a 30% buffer to ensure the chart has some space above the maximum heat load value
	 * which is important so the line doesn't intersect with the legend
	 * @returns {number} - The calculated maximum Y-axis value.
	 */
	const maxYValue = useMemo(() => {
		const maxValue = Math.max(
			...data.map((point) => Math.max(point.maxLine || 0, point.avgLine || 0)),
		)
		return Math.ceil((maxValue * 1.3) / 10000) * 10000
	}, [data])

	/**
	 * useMemo hook to calculate the minimum X-axis value.
	 * This is set to 10°F below the design temperature to allow some space before the design temperature.
	 * @returns {number} - The calculated minimum X-axis value.
	 */
	const minXValue = useMemo(() => design_temperature - 10, [design_temperature])

	/**
	 * useMemo hook to calculate the maximum X-axis value.
	 * This is set to the design set point (70°F).
	 * @returns {number} - The calculated maximum X-axis value.
	 */
	const maxXValue = useMemo(() => designSetPoint, [designSetPoint]) // End at the design set point

	return (
		<div>
			<div className="mb-4 text-lg font-semibold">Heating System Demand</div>

			<ResponsiveContainer width="100%" height={400}>
				<ComposedChart
					margin={{
						top: 20,
						right: 20,
						bottom: 50,
						left: 100,
					}}
					data={data}
				>
					<CartesianGrid stroke={COLOR_GREY_LIGHT} />

					<XAxis
						type="number"
						dataKey="temperature"
						name="Outdoor Temperature"
						unit="°F"
						domain={[minXValue, maxXValue]}
						tickCount={maxXValue - minXValue + 1} // Ensure whole numbers
					>
						<Label
							value="Outdoor Temperature (°F)"
							position="bottom"
							offset={20}
						/>
					</XAxis>

					<YAxis
						type="number"
						name="Heat Load"
						unit=" BTU/h"
						domain={[minYValue, maxYValue]}
					>
						<Label
							value="Heat Load (BTU/h)"
							position="left"
							angle={-90}
							offset={30}
						/>
					</YAxis>

					<Tooltip
						label="F"
						formatter={(value: any, name: string, props: any) => {
							// Extract the temperature from the payload
							const temperature = props.payload
								? props.payload?.temperature
								: null

							if (temperature !== null) {
								// Return formatted output, ensuring the temperature is shown in color below the heat load value
								return [
									`${Number(value).toLocaleString()} BTU/h`, // Heat load in BTU/h
									`${temperature}°F ${name.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature')}`, // Temperature in °F below the heat load value
								]
							}

							// Fallback in case the temperature is not available
							return [
								`${Number(value).toLocaleString()} BTU/h`,
								name
									.replace('Line', ' Heat Load')
									.replace('Point', ' at Design Temperature'),
							]
						}}
					/>

					<Legend
						wrapperStyle={{
							backgroundColor: COLOR_WHITE,
							border: `1px solid #ddd`,
							borderRadius: '3px',
							padding: '15px',
						}}
						align="right"
						verticalAlign="top"
						layout="middle"
					/>

					{/* Line for maximum heat load */}
					<Line
						type="monotone"
						dataKey="maxLine"
						stroke={COLOR_ORANGE}
						dot={false}
						name="Maximum, no internal or solar gain"
					/>

					{/* Line for average heat load */}
					<Line
						type="monotone"
						dataKey="avgLine"
						stroke={COLOR_BLUE}
						dot={false}
						name="Average, with internal & solar gain"
					/>

					{/* Scatter point for maximum heat load at design temperature */}
					<Scatter
						dataKey="maxPoint"
						fill={COLOR_ORANGE}
						name="Maximum at design temperature"
						shape="diamond"
						legendType="diamond"
					/>

					{/* Scatter point for average heat load at design temperature */}
					<Scatter
						dataKey="avgPoint"
						fill={COLOR_BLUE}
						name="Average at design temperature"
						shape="diamond"
						legendType="diamond"
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	)
}
