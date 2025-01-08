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
import { HeatLoadGraphToolTip } from './HeatLoadGraphToolTip'

const BUFFER_PERCENTAGE_MAX = 1.3; // 30% buffer
const Y_AXIS_ROUNDING_UNIT = 10000; // Rounding unit for minY and maxY
const Y_AXIS_MIN_VALUE = 0; // Always start the Y axis at 0

const roundDownToNearestTen = (n: number) => Math.floor(n / 10) * 10;

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
export function HeatLoad({
	heatLoadSummaryOutput,
}: HeatLoadProps): JSX.Element {
	const designSetPoint = 70 // Design set point (70°F), defined in external documentation - https://docs.google.com/document/d/16WlqY3ofq4xpalsfwRuYBWMbeUHfXRvbWU69xxVNCGM/edit?tab=t.0
	const { design_temperature } = heatLoadSummaryOutput
	const minTemperature = roundDownToNearestTen(design_temperature - 10) // Start temperature rounded down from design temperature for visual clarity
	const maxTemperature = designSetPoint + 2 // end the X axis at the designSetPoint plus 2f for visual clarity

	/**
	 * useMemo to build the HeatLoad graph data.
	 */
	const data = useMemo(() => {
		return buildHeatLoadGraphData(
			heatLoadSummaryOutput,
			minTemperature,
			designSetPoint,
			maxTemperature,
		)
	}, [heatLoadSummaryOutput])

	/**
	 * useMemo to iterate through the data and calculate the min and max values for the Y axis.
	 */
	const { minYValue, maxYValue } = useMemo(() => {
		let minValue = Infinity
		let maxValue = 0

		for (const point of data) {
			const maxLine = point.maxLine || 0
			const avgLine = point.avgLine || 0

			minValue = Math.min(minValue, maxLine || Infinity, avgLine || Infinity)
			maxValue = Math.max(maxValue, maxLine, avgLine)
		}

		// seet min and max Y axis values
		const minY = Y_AXIS_MIN_VALUE
		const adjustedMaxYValue = maxValue * BUFFER_PERCENTAGE_MAX;
		const maxY = Math.ceil(adjustedMaxYValue / Y_AXIS_ROUNDING_UNIT) * Y_AXIS_ROUNDING_UNIT

		return { minYValue: minY, maxYValue: maxY }
	}, [data])

	return (
		<div className="min-w-[625px] rounded-lg shadow-lg">
			<span className="mb-4 text-lg font-semibold">
				Heating System Demand
				<Icon name="question-mark-circled" className="ps-1" size="md" />
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
						domain={[minTemperature, maxTemperature]}
						tickCount={maxTemperature - minTemperature + 1} // Ensure whole number ticks
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

					<Tooltip content={<HeatLoadGraphToolTip />} />

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
