import React from 'react'
import { Legend } from 'recharts'
import { COLOR_WHITE, COLOR_ORANGE, COLOR_BLUE } from '../constants'

export default function WholeHomeUAComparisonLegend() {
	return (
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
	)
}
