import { COLOR_ORANGE, COLOR_BLUE } from '../constants'

/**
 * Custom legend component for the WholeHomeUAComparison chart.
 * This component renders a legend with two items: one for "This Home" (colored orange)
 * and one for "Comparison Homes" (colored blue).
 *
 * @returns {JSX.Element} A JSX element representing the custom legend.
 */
export default function WholeHomeUAComparisonLegend(): JSX.Element {
	return (
		<ul className="recharts-default-legend space-y-2">
			{/* Legend item for "This Home" */}
			<li className="flex items-center">
				<span
					className="mr-2 inline-block h-3 w-3 rounded-full"
					style={{ backgroundColor: COLOR_ORANGE }}
				></span>
				This Home
			</li>
			{/* Legend item for "Comparison Homes" */}
			<li className="flex items-center">
				<span
					className="mr-2 inline-block h-3 w-3 rounded-full"
					style={{ backgroundColor: COLOR_BLUE }}
				></span>
				Comparison Homes
			</li>
		</ul>
	)
}
