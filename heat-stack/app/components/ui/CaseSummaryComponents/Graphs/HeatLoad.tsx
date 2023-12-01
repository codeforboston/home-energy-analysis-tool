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
	{ x: 0, y: 74015 },
	{ x: 60.5, y: 10045 },
	{ x: 67, y: 3172 },
	{ x: 70, y: 0 },
	{ x: 8.4, y: 65133 },
]

export function HeatLoad() {
	return (
		<div>
			<div className="item-title">Heat Load</div>

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
						name=" Outdoor Temperature"
						unit="°F"
					/>
					<YAxis type="number" dataKey="y" name=" Heat Load" unit=" BTU/h" />
					<Tooltip cursor={{ strokeDasharray: '3 3' }} />
					<Scatter name="Heat Load" data={data} fill="#8884d8" />
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	)
}
