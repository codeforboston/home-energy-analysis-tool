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
import { HeatLoadGraphRecordSchema } from '../../../../../../types/types'

interface HeatLoadProps {
	data: HeatLoadGraphRecordSchema[]
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
						dataKey="balance_point"
						name=" Outdoor Temperature"
						unit="°F"
					/>
					<YAxis type="number" dataKey="heat_loss_rate" name=" Heat Load" unit=" BTU/h" />
					<Tooltip cursor={{ strokeDasharray: '3 3' }} />
					<Scatter name="Heat Load" data={data} fill="#8884d8" />
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	)
}
