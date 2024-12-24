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
export function HeatLoad({ heatLoadSummaryOutput }: HeatLoadProps): JSX.Element {
	const designSetPoint = 70 // Design set point (70°F), defined in external documentation
	const { design_temperature } = heatLoadSummaryOutput

	/**
 	 * useMemo to build the HeatLoad graph data.
 	 */
	const data = useMemo(() => {
		return buildHeatLoadGraphData(heatLoadSummaryOutput, designSetPoint)
	}, [heatLoadSummaryOutput])

	/**
 	 * useMemo to map through the data and calculate the min and max values for the Y axis.
 	 */
	const { minYValue, maxYValue } = useMemo(() => {
    let minValue = Infinity;
    let maxValue = 0;

    data.forEach((point) => {
        const maxLine = point.maxLine || 0;
        const avgLine = point.avgLine || 0;

        minValue = Math.min(minValue, maxLine || Infinity, avgLine || Infinity);
        maxValue = Math.max(maxValue, maxLine, avgLine);
    });

    const minY = Math.max(0, Math.floor((minValue * 0.8) / 10000) * 10000); // 20% buffer
    const maxY = Math.ceil((maxValue * 1.3) / 10000) * 10000; // 30% buffer

    return { minYValue: minY, maxYValue: maxY };
}, [data]);


	const minXValue = useMemo(() => design_temperature - 10, [design_temperature])

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
