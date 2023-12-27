import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

// data from Karle Heat Load Analysis Beta 7 2023-07-11
const data = [
	{ x: 58.5, y: 0.0534 },
	{ x: 60.5, y: 0.0508 },
	{ x: 62.5, y: 0.0528 },
]

export function StandardDeviationOfUA() {
	return (
		<div>
			<div className="item-title">Standard Deviation of UA</div>

			<ResponsiveContainer width="100%" height={400}>
				<ScatterChart
					margin={{
						top: 20,
						right: 20,
						bottom: 20,
						left: 100,
					}}
				>
					<CartesianGrid />
					<XAxis
						type="number"
						dataKey="x"
						name=" Balance Point"
						unit="°F"
						domain={[55, 65]}
					/>
					<YAxis
						type="number"
						dataKey="y"
						name=" "
						unit=""
						domain={[0.04, 0.06]}
					/>
					<Tooltip cursor={{ strokeDasharray: '3 3' }} />
					<Scatter name="Heat Load" data={data} fill="#8884d8" />
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	)
}
