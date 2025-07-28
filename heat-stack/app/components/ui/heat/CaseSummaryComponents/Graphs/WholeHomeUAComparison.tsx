import { useMemo } from 'react'
import {
	ComposedChart,
	CartesianGrid,
	Tooltip,
	Scatter,
	Line,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Label,
} from 'recharts'
import  { type SummaryOutputSchema } from '#/types/types'
import { Icon } from '../../../icon'
import { COLOR_BLUE, COLOR_GREY_LIGHT, COLOR_ORANGE } from '../constants'
import { defaultComparisonData, defaultLineData } from './home-comparison-data'
import { SharedCustomTooltip } from './SharedCustomToolTip'
import { WholeHomeUAComparisonLegend } from './WholeHomeUAComparisonLegend'
import { HelpButton } from '#app/components/ui/HelpButton.tsx'

type DataPoint = {
	x: number // X-coordinate, representing living area in square feet.
	y?: number // Y-coordinate, representing whole-home UA (optional for line chart).
	yLine?: number // Y-coordinate for line chart (used in `lineData`).
	color?: string // Color of the data point (used for scatter points).
	label?: string // Label for tooltip and legend association.
}

type ChartData = {
	combinedData: DataPoint[]
	lineData: DataPoint[]
}

type ScatterShapeProps = {
	cx: number
	cy: number
	payload: {
		color: string
	}
}

type WholeHomeUAComparisonProps = {
	heatLoadSummaryOutput: SummaryOutputSchema
	livingArea: number
	comparisonData?: { x: number; y: number }[]
}

/**
 * Custom scatter shape renderer for Recharts' Scatter component.
 * This function is used to render a custom color for each point
 * so we can display the selected home in orange rather than blue
 *
 * @param {unknown} props - The properties passed to the custom scatter shape function.
 *                          These properties are typecast to `ScatterShapeProps` since
 * 													Recharts expects props to be 'unknown' due to dynamic data
 *
 * @returns {JSX.Element} A JSX element
 */
const getScatterShape = (props: unknown): React.ReactElement => {
	const scatterProps = props as ScatterShapeProps
	const isThisHome = scatterProps.payload.color === COLOR_ORANGE
	
	// Make "This Home" point larger and add stroke for better visibility
	return (
		<circle
			cx={scatterProps.cx}
			cy={scatterProps.cy}
			r={isThisHome ? 8 : 6}
			fill={scatterProps.payload.color}
			stroke={isThisHome ? "#000" : "none"}
			strokeWidth={isThisHome ? 1 : 0}
		/>
	)
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
}: WholeHomeUAComparisonProps): React.ReactElement {
	const { whole_home_heat_loss_rate } = heatLoadSummaryOutput

	// Prepare the data for the chart
	const data: ChartData = useMemo(() => {
		const comparisonDataWithLabel: DataPoint[] = comparisonData.map(
			(d: any) => ({
				...d,
				color: COLOR_BLUE,
				label: 'Comparison Home',
			}),
		)

		const thisHomeData: DataPoint = {
			x: livingArea,
			y: Math.round(whole_home_heat_loss_rate),
			color: COLOR_ORANGE,
			label: 'This Home'
		}

		return {
			combinedData: [...comparisonDataWithLabel, thisHomeData],
			lineData: defaultLineData,
		}
	}, [comparisonData, whole_home_heat_loss_rate, livingArea])

	return (
		<div className="mt-8 min-w-[625px] rounded-lg pb-4 shadow-lg">
			{/* Title and icon for the chart */}
			<div className="mb-4 mt-4 text-lg font-semibold flex items-center gap-2">
				Whole-home Heat Loss Comparison
				<div className="flex-1 flex justify-end items-center">
					<HelpButton keyName="whole_home_heat_loss_graph.help" />
				</div>
			</div>

			{/* Responsive container to ensure chart resizes */}
			<div className="relative w-full h-[400px]">
				<ResponsiveContainer width="100%" height={400}>
					{/* Main composed chart component */}
					<ComposedChart
						width={500}
						height={400}
						data={[...data.combinedData, ...data.lineData]}
						margin={{
							top: 20,
							right: 20,
							bottom: 30,
							left: 80,
						}}
					>
						{/* Grid lines for the chart */}
						{/* <CartesianGrid stroke="#f5f5f5" /> */}
						<CartesianGrid stroke={COLOR_GREY_LIGHT} strokeDasharray="3 3"/>

						{/* Tooltip with custom content for heat loss information */}
						<Tooltip content={<SharedCustomTooltip />} wrapperStyle={{ zIndex: 20 }} />

						{/* X-axis for the chart with Living Area label */}
						<XAxis type="number" dataKey="x" name="Living Area" domain={[0, 6000]} tickCount={13 } // Ensure whole number ticks
						>
							<Label
								value="Living Area (sf)"
								position="bottom"
								offset={15} // Adjusted offset for better visibility
							/>
						</XAxis>

						{/* Y-axis for the chart with Whole-home UA label */}
						<YAxis type="number" dataKey="y" name="Whole-home UA">
							<Label
								value="Whole-home UA (BTU/h - °F)"
								position="left"
								angle={-90}
								offset={20}
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
					</ComposedChart>
				</ResponsiveContainer>
				<WholeHomeUAComparisonLegend />
			</div>
		</div>
	)
}