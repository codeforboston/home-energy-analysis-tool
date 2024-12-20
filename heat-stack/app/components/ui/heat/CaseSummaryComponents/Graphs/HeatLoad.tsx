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
import { HeatLoadGrid } from '../HeatLoadGrid'
import {
	COLOR_GREY_LIGHT,
	COLOR_WHITE,
	COLOR_ORANGE,
	COLOR_BLUE,
} from '../constants'
import {
	calculateAvgHeatLoad,
	calculateMaxHeatLoad,
} from '../utility/heat-load-calculations'
import { buildHeatLoadGraphData } from '../utility/build-heat-load-graph-data'

type HeatLoadProps = {
	heatLoadSummaryOutput: SummaryOutputSchema
}

/**
 * HeatLoad component renders a chart displaying the heating system demand based on different outdoor temperatures.
 * It includes two lines for the maximum and average heat loads, with scatter points at the design temperature.
 *
 * @param {HeatLoadProps} props - The props containing heat load data to render the chart.
 * @returns {JSX.Element} - The rendered chart component.
 */
export function HeatLoad({ heatLoadSummaryOutput }: HeatLoadProps) {
	const designSetPoint = 70 // Design set point (70°F), defined in external documentation
	const { design_temperature } = heatLoadSummaryOutput

	/**
	 * useMemo hook to calculate the heat load data for the maximum and average lines.
	 * This data is built from the heat load summary and design temperature.
	 *
	 * @returns {Array} - Array of data points for the lines and scatter points.
	 */
	const data = useMemo(() => {
		return buildHeatLoadGraphData(heatLoadSummaryOutput, designSetPoint)
	}, [heatLoadSummaryOutput])

	/**
	 * useMemo hook to calculate the minimum Y-axis value.
	 * Includes a 20% buffer below the minimum heat load value to ensure some space in the chart.
	 *
	 * @returns {number} - The calculated minimum Y-axis value.
	 */
	const minYValue = useMemo(() => {
		const minValue = Math.min(
			...data.map((point) =>
				Math.min(point.maxLine || Infinity, point.avgLine || Infinity),
			),
		)
		return Math.max(0, Math.floor((minValue * 0.8) / 10000) * 10000) // 20% buffer
	}, [data])

	/**
	 * useMemo hook to calculate the maximum Y-axis value.
	 * Includes a 30% buffer above the maximum heat load value to ensure space above the line.
	 *
	 * @returns {number} - The calculated maximum Y-axis value.
	 */
	const maxYValue = useMemo(() => {
		const maxValue = Math.max(
			...data.map((point) => Math.max(point.maxLine || 0, point.avgLine || 0)),
		)
		return Math.ceil((maxValue * 1.3) / 10000) * 10000 // 30% buffer
	}, [data])

	/**
	 * useMemo hook to calculate the minimum X-axis value.
	 * Set 10°F below the design temperature to provide some space before the design point.
	 *
	 * @returns {number} - The calculated minimum X-axis value.
	 */
	const minXValue = useMemo(() => design_temperature - 10, [design_temperature])

	/**
	 * useMemo hook to calculate the maximum X-axis value.
	 * Set to the design set point (70°F) to end the chart at the design temperature.
	 *
	 * @returns {number} - The calculated maximum X-axis value.
	 */
	const maxXValue = useMemo(() => designSetPoint, [designSetPoint])

	return (
		<div className="min-w-[625px] rounded-lg shadow-lg">
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
						tickCount={maxXValue - minXValue + 1} // Ensure whole number ticks
					>
						<Label
							value="Outdoor Temperature (°F)"
							position="bottom"
							offset={20}
						/>
					</XAxis>

					<YAxis type="number" name="Heat Load" domain={[minYValue, maxYValue]}>
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
								// Format tooltip with temperature and heat load values
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
			<HeatLoadGrid
				setPoint={designSetPoint}
				averageHeatLoad={calculateAvgHeatLoad(
					heatLoadSummaryOutput,
					design_temperature,
					designSetPoint,
				)}
				maxHeatLoad={calculateMaxHeatLoad(
					heatLoadSummaryOutput,
					design_temperature,
					designSetPoint,
				)}
			/>
		</div>
	)
}
