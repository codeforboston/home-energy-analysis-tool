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
			dashed: true,
		},
		{
			name: 'Maximum at design temperature',
			color: COLOR_ORANGE,
			shape: 'diamond',
		},
		{
			name: 'Average at design temperature',
			color: COLOR_BLUE,
			shape: 'square',
		},
	]

	const LineIcon = ({ color, dashed }: { color: string; dashed?: boolean }) => (
		<svg width="32" height="10">
			<line
				x1="0"
				y1="5"
				x2="32"
				y2="5"
				stroke={color}
				strokeWidth="3"
				strokeDasharray={dashed ? '8 4' : undefined}
			/>
		</svg>
	)

	const DiamondIcon = ({ color }: { color: string }) => (
		<svg width="16" height="16">
			<polygon points="8,1 15,8 8,15 1,8" fill={color} />
		</svg>
	)

	const SquareIcon = ({ color }: { color: string }) => (
		<svg width="16" height="16">
			<rect x="2" y="2" width="12" height="12" fill={color} />
		</svg>
	)

	return (
		<div className="absolute right-6 top-6 rounded border border-gray-200 bg-white p-4 shadow-sm">
			{legendItems.map((item, index) => (
				<div key={index} className="mb-2 flex items-center gap-2 last:mb-0">
					{item.type === 'line' ? (
						<LineIcon color={item.color} dashed={item.dashed} />
					) : item.shape === 'diamond' ? (
						<DiamondIcon color={item.color} />
					) : (
						<SquareIcon color={item.color} />
					)}
					<span className="text-sm">{item.name}</span>
				</div>
			))}
		</div>
	)
}
