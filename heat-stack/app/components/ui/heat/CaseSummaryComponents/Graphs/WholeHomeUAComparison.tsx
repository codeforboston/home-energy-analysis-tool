import React, { useMemo } from 'react'
import {
	ComposedChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Scatter,
	Legend,
	ResponsiveContainer,
} from 'recharts'
import {
	COLOR_BLUE,
	COLOR_ORANGE,
	COLOR_WHITE,
	defaultComparisonData,
} from '../constants'
import { CustomTooltip } from './CustomToolTip'

const defaultLineData = [
	{ x: 0, yLine: 0 },
	{ x: 5000, yLine: 1650 },
]

interface WholeHomeUAComparisonProps {
	heatLoadSummaryOutput: any
	livingArea: number
	comparisonData: any
}

export function WholeHomeUAComparison({
	heatLoadSummaryOutput,
	livingArea,
	comparisonData = defaultComparisonData,
}: WholeHomeUAComparisonProps) {
	const { whole_home_heat_loss_rate } = heatLoadSummaryOutput

	const data = useMemo(() => {
		// Merge the "This Home" and "Comparison Homes" data into a single array
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
		<div>
			<div className="item-title">Whole-home heat loss comparison</div>
			<ResponsiveContainer width="100%" height={400}>
				<ComposedChart
					width={500}
					height={400}
					data={[...data.combinedData, ...data.lineData]}
					margin={{
						top: 20,
						right: 80,
						bottom: 20,
						left: 100,
					}}
				>
					<CartesianGrid stroke="#f5f5f5" />
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
							if (payload && payload.length) {
								const point = payload[0] // Get the first point (since there's only one per hover)
								if (point) {
									return [`${value}`, point.label || name] // Show the name based on the label
								}
							}
							return null // Exclude line elements or multiple values
						}}
					/>
					<XAxis type="number" dataKey="x" name="Living Area" unit=" sf" />
					<YAxis
						type="number"
						dataKey="y"
						name="Whole-home UA"
						unit="BTU/h-°F"
						domain={[0, 'auto']}
					/>
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

					<Line
						data={data.lineData}
						dataKey="yLine"
						dot={false}
						activeDot={false}
						legendType="none"
					/>
					{/* Hard-coded Legend */}
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
