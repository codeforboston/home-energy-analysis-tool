import { COLOR_ORANGE, COLOR_BLUE } from '../constants.ts'

export const CustomLegend = () => {
	const legendItems = [
		{
			name: 'Maximum, no internal or solar gain',
			color: COLOR_ORANGE,
			type: 'line',
		},
		{
			name: 'Average, with internal & solar gain',
			color: COLOR_BLUE,
			type: 'line',
		},
		{
			name: 'Maximum at design temperature',
			color: COLOR_ORANGE,
			type: 'diamond',
		},
		{
			name: 'Average at design temperature',
			color: COLOR_BLUE,
			type: 'diamond',
		},
	]

	return (
		<div className="absolute right-6 top-6 rounded border border-gray-200 bg-white p-4 shadow-sm">
			{legendItems.map((item, index) => (
				<div key={index} className="mb-2 flex items-center gap-2 last:mb-0">
					{item.type === 'line' ? (
						<div
							className="h-0.5 w-8"
							style={{ backgroundColor: item.color }}
						/>
					) : (
						<div
							className="h-3 w-3 rotate-45"
							style={{ backgroundColor: item.color }}
						/>
					)}
					<span className="text-sm">{item.name}</span>
				</div>
			))}
		</div>
	)
}
