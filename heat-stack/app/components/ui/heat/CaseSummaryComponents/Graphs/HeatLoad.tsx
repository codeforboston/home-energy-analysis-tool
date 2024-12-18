import React from 'react'
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

interface HeatLoadProps {
	data: { x: number, y: number}[];
}

export function HeatLoad({ data }: HeatLoadProps) {
	return (
		<div>
			<div className="item-title">Heating System Demand</div>

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
