import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function Graphs() {
	const data = [
		{
			name: '58 F',
			uv: 15,
			amt: 9,
		},
		{
			name: '59 F',
			uv: 11.3,
			amt: 8.3,
		},
		{
			name: '60 F',
			uv: 7.9,
			amt: 8.6,
		},
		{
			name: '61 F',
			uv: 6.4,
			amt: 7.5,
		},
		{
			name: '62 F',
			uv: 7.1,
			amt: 8.2,
		},
		{
			name: '63 F',
			uv: 13.12,
			amt: 7.89,
		},
	]

	return (
		<div className="section-title">
			Graphs
			<div className="item-title">
				Balance point
				<LineChart
					width={750}
					height={450}
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Line type="monotone" dataKey="uv" stroke="#82ca9d" />
				</LineChart>
			</div>
		</div>
	)
}
