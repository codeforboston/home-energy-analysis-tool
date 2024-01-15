import { AnalysisHeader } from './AnalysisHeader.tsx'
import { HeatLoad } from './Graphs/HeatLoad.tsx'
import { WholeHomeUAComparison } from './Graphs/WholeHomeUAComparison.tsx'

export function Graphs() {
	const fuelType = 'Natural Gas'
	return (
		<div>
			<h2 className="text-5xl font-extrabold tracking-wide">
				Heat Load Analysis
			</h2>
			Fuel Type
			{fuelType}
			<AnalysisHeader />
			<HeatLoad />
			<WholeHomeUAComparison />
		</div>
	)
}
