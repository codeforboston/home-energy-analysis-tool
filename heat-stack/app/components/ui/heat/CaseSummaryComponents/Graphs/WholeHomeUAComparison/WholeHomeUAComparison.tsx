import React, { useMemo } from 'react'
import {
	ComposedChart,
	CartesianGrid,
	Tooltip,
	Scatter,
	Line,
	Legend,
	XAxis,
	YAxis,
	ResponsiveContainer,
	TooltipProps,
	ScatterPoint,
	Label,
} from 'recharts'
import { COLOR_BLUE, COLOR_ORANGE } from '../constants'
import { CustomTooltip } from '../Shared/CustomToolTip'
import { Icon } from '../../../../icon'
import { defaultComparisonData, defaultLineData } from './home-comparison-data'
import { SummaryOutputSchema } from '../../../../../../../types/types'
import WholeHomeUAComparisonLegend from './WholeHomeUAComparisonLegend'

type DataPoint = {
	x: number // X-coordinate, representing living area in square feet.
	y?: number // Y-coordinate, representing whole-home UA (optional for line chart).
	yLine?: number // Y-coordinate for line chart (used in `lineData`).
	color?: string // Color of the data point (used for scatter points).
	label?: string // Label for tooltip and legend association.
}

type ChartData = {
	combinedData: DataPoint[] // Array of data points for the scatter plot.
	lineData: DataPoint[] // Array of data points for the line chart.
}

type WholeHomeUAComparisonProps = {
	heatLoadSummaryOutput: SummaryOutputSchema
	livingArea: number
	comparisonData: { x: number; y: number }[]
}

const toolTipFormatter = (
	value: number | string,
	name: string,
	props: TooltipProps,
) => {
	const { payload } = props
	if (payload && payload.length) {
		const point = payload[0]
		if (point) {
			return [`${value}`, point.label || name]
		}
	}
	return null // Exclude line elements or multiple values
}

const getScatterShape = (
	props: ScatterPoint & { payload: { color: string } },
) => <circle cx={props.cx} cy={props.cy} r={6} fill={props.payload.color} />

/**
 * Component that renders a comparison of whole-home heat loss with scatter and line chart
 * @function
 * @param {WholeHomeUAComparisonProps} props - The component props
 * @returns {JSX.Element} The rendered chart component
 */
export function WholeHomeUAComparison({
	heatLoadSummaryOutput,
	livingArea,
	comparisonData = defaultComparisonData,
}: WholeHomeUAComparisonProps): JSX.Element {
	const { whole_home_heat_loss_rate } = heatLoadSummaryOutput

	// Prepare the data for the chart
	const data: ChartData = useMemo(() => {
		const comparisonDataWithLabel = comparisonData.map((d: any) => ({
			...d,
			color: COLOR_BLUE,
			label: 'Comparison Home',
		}))

		const thisHomeData = {
			x: livingArea,
			y: Math.round(whole_home_heat_loss_rate),
			color: COLOR_ORANGE,
			label: 'This Home',
		}

		return {
			combinedData: [...comparisonDataWithLabel, thisHomeData],
			lineData: defaultLineData,
		}
	}, [comparisonData, whole_home_heat_loss_rate, livingArea])

	return (
		<div className="mt-8 min-w-[625px] rounded-lg pb-4 shadow-lg">
			{/* Title and icon for the chart */}
			<span className="mb-4 text-lg font-semibold">
				Whole-home heat loss comparison{' '}
				<Icon name="question-mark-circled" size="md" />{' '}
			</span>

			{/* Responsive container to ensure chart resizes */}
			<ResponsiveContainer width="100%" height={400}>
				{/* Main composed chart component */}
				<ComposedChart
					width={500}
					height={400}
					data={[...data.combinedData, ...data.lineData]}
					margin={{
						top: 20,
						right: 80,
						bottom: 30,
						left: 80,
					}}
				>
					{/* Grid lines for the chart */}
					<CartesianGrid stroke="#f5f5f5" />

					{/* Tooltip with custom content for heat loss information */}
					<Tooltip
						content={
							<CustomTooltip
								xLabel="Living Area"
								yLabel="Whole-home UA"
								unitX=" sf"
								unitY=" BTU/h-°F"
							/>
						}
						formatter={toolTipFormatter}
					/>

					{/* X-axis for the chart with Living Area label */}
					<XAxis
						type="number"
						dataKey="x"
						name="Living Area"
						domain={[0, 'auto']}
					>
						<Label
							value="Living Area (sf)"
							position="bottom"
							offset={15} // Adjusted offset for better visibility
						/>
					</XAxis>

					{/* Y-axis for the chart with Whole-home UA label */}
					<YAxis
						type="number"
						dataKey="y"
						name="Whole-home UA"
						domain={[0, 'auto']}
					>
						<Label
							value="Whole-home UA (BTU/h - °F)"
							position="left"
							angle={-90}
							offset={20}
							dy={-120} // Adjusted vertical offset for better alignment
						/>
					</YAxis>

					{/* Scatter plot for the points */}
					<Scatter
						name="Whole-home UA (BTU/h - °F)"
						data={data.combinedData}
						shape={getScatterShape}
						dataKey="y"
					/>

					{/* Line chart for the comparison homes data */}
					<Line
						data={data.lineData}
						dataKey="yLine"
						dot={false}
						activeDot={false}
						legendType="none"
					/>

					{/* Custom legend */}
					<Legend
						wrapperStyle={{
							backgroundColor: 'white',
							border: '1px solid #ddd',
							borderRadius: '3px',
							padding: '15px',
						}}
						align="right"
						verticalAlign="top"
						layout="vertical"
						content={<WholeHomeUAComparisonLegend />}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	)
}
