// heat-stack/app/components/ui/heat/CaseSummaryComponents/Graphs/HeatLoad.tsx
import { useMemo } from 'react'
import {
	ComposedChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Label,
	Scatter,
} from 'recharts'
import { HelpButton } from '#app/components/ui/HelpButton.tsx'
import { type SummaryOutputSchema } from '../../../../../../types/types.ts'
import { DESIGN_SET_POINT } from '../../../../../global_constants.ts'
import {
	COLOR_GREY_LIGHT,
	COLOR_ORANGE,
	COLOR_BLUE,
} from '../constants.ts'
import { HeatLoadGrid } from '../HeatLoadGrid.tsx'
import { buildHeatLoadGraphData } from '../utility/build-heat-load-graph-data.ts'
import {
	calculateAvgHeatLoad,
	calculateMaxHeatLoad,
} from '../utility/heat-load-calculations.ts'
import { CustomLegend } from './HeatLoadGraphLegend.tsx'
import { HeatLoadGraphToolTip } from './HeatLoadGraphToolTip.tsx'

const X_AXIS_BUFFER_PERCENTAGE_MAX = 1.3; // 30% buffer
const Y_AXIS_ROUNDING_UNIT = 10000; // Rounding unit for minY and maxY
const Y_AXIS_MIN_VALUE = 0; // Always start the Y axis at 0

const roundDownToNearestTen = (n: number) => Math.floor(n / 10) * 10; // Used for determining the start temperature on the X axis

type HeatLoadProps = {
	heatLoadSummaryOutput: SummaryOutputSchema
}

/**
 * HeatLoad component renders a chart displaying the heating system demand based on different outdoor temperatures.
 * It includes two lines for the maximum and average heat loads, with scatter points at the design temperature.
 *
 * @param {HeatLoadProps} props - The props containing heat load data to render the chart.
 * @returns {React.ReactElement } - The rendered chart component.
 */
export function HeatLoad({
	heatLoadSummaryOutput,
}: HeatLoadProps): React.ReactElement  {
	const maxTemperature = DESIGN_SET_POINT + 2 // end the X axis at the DESIGN_SET_POINT plus 2f for visual clarity

	const { design_temperature, whole_home_heat_loss_rate } = heatLoadSummaryOutput
	const minTemperature = roundDownToNearestTen(design_temperature - 10) // Start temperature rounded down from design temperature for visual clarity


	/**
	 * useMemo to build the HeatLoad graph data.
	 */
	const data = useMemo(() => {
		if (!heatLoadSummaryOutput) {
			return []; // Return empty array if data is not available yet
		  }

		return buildHeatLoadGraphData(
			heatLoadSummaryOutput,
			minTemperature,
			DESIGN_SET_POINT,
			maxTemperature,
		)
	}, [heatLoadSummaryOutput])

	/**
	 * useMemo to iterate through the data and calculate the min and max values for the Y axis.
	 */
	const { minYValue, maxYValue } = useMemo(() => {
		if (!data || data.length === 0) {
			return { minYValue: Y_AXIS_MIN_VALUE, maxYValue: Y_AXIS_ROUNDING_UNIT }; // Default values
		  }
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
		const adjustedMaxYValue = maxValue * X_AXIS_BUFFER_PERCENTAGE_MAX;
		const maxY = Math.ceil(adjustedMaxYValue / Y_AXIS_ROUNDING_UNIT) * Y_AXIS_ROUNDING_UNIT

		return { minYValue: minY, maxYValue: maxY }
	}, [data])


	return (
		<div className="min-w-[625px] rounded-lg shadow-lg">
			<div className="mb-4 mt-4 text-lg font-semibold flex items-center gap-2">
				Heating System Demand
					<HelpButton keyName="heat_demand_graph.help" />
			</div>



			<div className="relative w-full h-[400px]">
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
					<CartesianGrid stroke={COLOR_GREY_LIGHT} strokeDasharray="3 3"/>

					<XAxis
						type="number"
						dataKey="temperature"
						name="Outdoor Temperature"
						domain={[minTemperature, maxTemperature]}
						tickCount={(maxTemperature - minTemperature) / 4 } // Ensure whole number ticks
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
			<CustomLegend />
			</div>

			{heatLoadSummaryOutput && <HeatLoadGrid
				setPoint={DESIGN_SET_POINT}
				averageHeatLoad={calculateAvgHeatLoad(
					heatLoadSummaryOutput,
					design_temperature,
					DESIGN_SET_POINT,
				)}
				maxHeatLoad={calculateMaxHeatLoad(
					whole_home_heat_loss_rate,
					design_temperature,
					DESIGN_SET_POINT,
				)}
			/>}
		</div>
	)
}
