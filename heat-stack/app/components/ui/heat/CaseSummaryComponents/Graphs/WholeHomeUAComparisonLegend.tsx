import { COLOR_ORANGE, COLOR_BLUE } from '../constants.ts'

export const WholeHomeUAComparisonLegend = () => {
	const legendItems = [
		{
			name: 'This Home',
			color: COLOR_ORANGE,
			type: 'circle',
			isThisHome: true,
		},
		{ name: 'Comparison Homes', color: COLOR_BLUE, type: 'circle' },
		{ name: 'Trend Line', color: '#333', type: 'line' },
	]

	return (
		<div className="mx-4 mb-4 mt-2 rounded border border-gray-200 bg-white p-4 shadow-sm md:absolute md:bottom-20 md:right-6 md:z-10 md:m-0">
			{legendItems.map((item, index) => (
				<div key={index} className="mb-2 flex items-center gap-2 last:mb-0">
					{item.type === 'line' ? (
						<div
							className="h-0.5 w-8"
							style={{ backgroundColor: item.color }}
						/>
					) : (
						<div
							className={`${item.isThisHome ? 'h-4 w-4' : 'h-3 w-3'} rounded-full`}
							style={{
								backgroundColor: item.color,
								border: item.isThisHome ? '1px solid black' : 'none',
							}}
						/>
					)}
					<span className="text-sm">{item.name}</span>
				</div>
			))}
		</div>
	)
}

export default WholeHomeUAComparisonLegend
