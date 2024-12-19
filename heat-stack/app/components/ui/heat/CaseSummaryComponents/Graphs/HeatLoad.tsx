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
import { Icon } from '../../../icon'

// Constants for chart styling
const COLOR_ORANGE = '#FF5733'
const COLOR_BLUE = '#8884d8'
const COLOR_GREY = '#999999'
const COLOR_GREY_LIGHT = '#f5f5f5'
const COLOR_WHITE = '#fff'

type ChartGridProps = {
	setPoint: number
	averageHeatLoad: number
	maxHeatLoad: number
}
const ChartGrid = ({
	setPoint,
	averageHeatLoad,
	maxHeatLoad,
}: ChartGridProps) => {
	return (
		<div className="container mx-auto p-4">
			<div className="grid grid-cols-3 gap-4">
				{/* Grid Item 1 */}
				<div className="flex items-center justify-center border-r-2 border-gray-300 p-6">
					<div className="flex flex-col items-center">
						<div className="text-gray-500">Set Point</div>
						<div className="font-semibold">{`${setPoint} °F`}</div>
					</div>
				</div>

				{/* Grid Item 2 */}
				<div className="flex items-center justify-center border-r-2 border-gray-300 p-6">
					<div className="flex flex-col items-center">
						<div className="text-gray-500">Max Heat Load</div>
						<div className="font-semibold">{`${maxHeatLoad} BTU/h`}</div>
					</div>
				</div>

				{/* Grid Item 3 */}
				<div className="flex items-center justify-center p-6">
					<div className="flex flex-col items-center">
						<div className="text-gray-500">Average Heat Load</div>
						<div className="font-semibold">{`${averageHeatLoad} BTU/h`}</div>
					</div>
				</div>
			</div>
		</div>
	)
}

type HeatLoadProps = {
	heatLoadSummaryOutput: SummaryOutputSchema
}

/**
 * HeatLoad component renders a chart that displays the heating system demand based on different temperature values.
 * The chart includes two lines representing maximum and average heat load, along with scatter points at design temperatures.
 * @param {HeatLoadProps} props - The props containing the heat load data to render the chart.
 * @returns {JSX.Element} - The rendered chart component.
 */
export function HeatLoad({ heatLoadSummaryOutput }: HeatLoadProps) {
  console.log('heatLoadSummaryOutput: ', heatLoadSummaryOutput)
	const designSetPoint = 70 // Design set point is 70°F as described in this document: https://docs.google.com/document/d/16WlqY3ofq4xpalsfwRuYBWMbeUHfXRvbWU69xxVNCGM/edit?tab=t.0
	const {
		whole_home_heat_loss_rate,
		average_indoor_temperature,
		estimated_balance_point,
		design_temperature,
	} = heatLoadSummaryOutput

	/**
	 * Calculates the maximum heat load for a given temperature.
	 * The formula used is based on the design set point, the provided temperature, and the whole home heat loss rate.
	 * If the result is negative, it returns 0 to avoid negative heat loads.
	 *
	 * @param {number} temperature - The outdoor temperature at which to calculate the heat load.
	 * @returns {number} - The calculated maximum heat load in BTU/h for the given temperature.
	 */
	const getMaxHeatLoadForTemperature = (temperature: number): number =>
		Math.round(
			Math.max(0, (designSetPoint - temperature) * whole_home_heat_loss_rate),
		)

	/**
	 * Calculates the average heat load for a given temperature considering internal and solar gain.
	 * The formula incorporates the design set point, average indoor temperature, the estimated balance point,
	 * and the outdoor temperature to compute the average heat load.
	 * If the result is negative, it returns 0 to avoid negative heat loads.
	 *
	 * @param {number} temperature - The outdoor temperature at which to calculate the heat load.
	 * @returns {number} - The calculated average heat load in BTU/h for the given temperature.
	 */
	const getAvgHeatLoadForTemperature = (temperature: number): number =>
		Math.round(
			Math.max(
				0,
				(designSetPoint -
					average_indoor_temperature +
					estimated_balance_point -
					temperature) *
					whole_home_heat_loss_rate,
			),
		)

	/**
	 * useMemo hook to calculate the heat load data points for max and avg lines.
	 * The data is computed based on the provided heat load summary and the design temperature
	 * using the calculations provided in this document: https://docs.google.com/document/d/16WlqY3ofq4xpalsfwRuYBWMbeUHfXRvbWU69xxVNCGM/edit?tab=t.0
	 * @returns {Array} - An array of data points for the lines and scatter points.
	 */
	const data = useMemo(() => {
		const points = []

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

		// point for avg line at start
		points.push({
			temperature: startTemperature,
			avgLine: avgHeatLoadStart,
		})
		// point for avg line at design temperature
		points.push({
			temperature: design_temperature,
			avgLine: avgHeatLoad,
			avgPoint: avgHeatLoad,
		})
		// point for avg line at design set point
		points.push({
			temperature: designSetPoint,
			avgLine: avgHeatLoadSetPoint,
		})

		// Add the point for max line at start temperature
		points.push({
			temperature: startTemperature,
			maxLine: maxHeatLoadStart,
		})
		// Add the point for max line at design temperature
		points.push({
			temperature: design_temperature,
			maxLine: maxHeatLoad,
			maxPoint: maxHeatLoad,
		})
		// Add the point for max line at design set point
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
		<div className="rounded-lg shadow-lg min-w-[625px]">
			<span className="mb-4 text-lg font-semibold">
				Heating System Demand <Icon name="question-mark-circled" size="md" />{' '}
			</span>

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
						formatter={(value: any, name: string, props: any) => {
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
			<ChartGrid
				setPoint={designSetPoint}
				averageHeatLoad={getAvgHeatLoadForTemperature(design_temperature)}
				maxHeatLoad={getMaxHeatLoadForTemperature(design_temperature)}
			/>
		</div>
	)
}
