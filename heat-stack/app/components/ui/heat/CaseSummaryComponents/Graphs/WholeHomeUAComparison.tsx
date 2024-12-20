import React, { useMemo } from 'react'
import {
	ComposedChart,
	CartesianGrid,
	Tooltip,
	Scatter,
	Line,
	XAxis,
	YAxis,
	Legend,
	ResponsiveContainer,
	Label,
} from 'recharts'
import {
	COLOR_BLUE,
	COLOR_ORANGE,
	COLOR_WHITE,
	defaultComparisonData,
} from '../constants'
import { CustomTooltip } from './CustomToolTip'
import { Icon } from '../../../icon'

// Default data for the line chart
const defaultLineData = [
	{ x: 0, yLine: 0 },
	{ x: 5000, yLine: 1650 },
]

/**
 * Props for the WholeHomeUAComparison component
 * @interface
 */
interface WholeHomeUAComparisonProps {
	heatLoadSummaryOutput: any
	livingArea: number
	comparisonData: any
}

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
}: WholeHomeUAComparisonProps) {
	// Extract heat loss rate from the provided output
	const { whole_home_heat_loss_rate } = heatLoadSummaryOutput

	// Prepare the data for the chart using useMemo to optimize recalculations
	const data = useMemo(() => {
		// Merge the "This Home" and "Comparison Homes" data into a single array
		const comparisonDataWithLabel = comparisonData.map((d: any) => ({
			...d,
			color: COLOR_BLUE,
			label: 'Comparison Home',
		}))

		// Data for "This Home"
		const thisHomeData = {
			x: livingArea,
			y: Math.round(whole_home_heat_loss_rate),
			color: COLOR_ORANGE,
			label: 'This Home',
		}

		// Combine both sets of data for use in the chart
		return {
			combinedData: [...comparisonDataWithLabel, thisHomeData],
			lineData: defaultLineData,
		}
	}, [comparisonData, whole_home_heat_loss_rate, livingArea])

	return (
		<div className="mt-8 min-w-[625px] rounded-lg shadow-lg">
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
						formatter={(value, name, props) => {
							const { payload } = props
							// Only show the tooltip for individual points
							if (payload && payload.length) {
								const point = payload[0] // Get the first point (since there's only one per hover)
								if (point) {
									return [`${value}`, point.label || name] // Show the name based on the label
								}
							}
							return null // Exclude line elements or multiple values
						}}
					/>

					{/* X-axis for the chart with Living Area label */}
					<XAxis
						type="number"
						dataKey="x"
						name="Living Area"
						domain={[0, 'auto']}
					>
						{/* Label for the X-axis */}
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
						{/* Label for the Y-axis */}
						<Label
							value="Whole-home UA (BTU/h - °F)"
							position="left"
							angle={-90}
							offset={20}
							dy={-120} // Adjusted vertical offset for better alignment
						/>
					</YAxis>

					{/* Scatter plot for the "This Home" and "Comparison Homes" data */}
					<Scatter
						name="Whole Home UA"
						data={data.combinedData}
						shape={(props) => (
							<circle
								cx={props.cx}
								cy={props.cy}
								r={6}
								fill={props.payload.color}
							/>
						)}
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

					{/* Hard-coded legend for this component */}
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
						content={() => (
							<ul className="recharts-default-legend">
								{/* Legend item for "This Home" */}
								<li>
									<span
										className="recharts-symbol"
										style={{
											display: 'inline-block',
											width: '12px',
											height: '12px',
											backgroundColor: COLOR_ORANGE,
											borderRadius: '50%',
											marginRight: '5px',
										}}
									></span>
									This Home
								</li>
								{/* Legend item for "Comparison Homes" */}
								<li>
									<span
										className="recharts-symbol"
										style={{
											display: 'inline-block',
											width: '12px',
											height: '12px',
											backgroundColor: COLOR_BLUE,
											borderRadius: '50%',
											marginRight: '5px',
										}}
									></span>
									Comparison Homes
								</li>
							</ul>
						)}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	)
}
