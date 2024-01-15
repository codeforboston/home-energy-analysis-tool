import { AnalysisHeader } from './AnalysisHeader.tsx'
import { HeatLoad } from './Graphs/HeatLoad.tsx'
import { WholeHomeUAComparison } from './Graphs/WholeHomeUAComparison.tsx'

export function Graphs() {
	const fuelType = 'Natural Gas'
	const titleClassTailwind = 'text-5xl font-extrabold tracking-wide'
	return (
		<div>
			<h2 className={`${titleClassTailwind}`}>Heat Load Analysis</h2>
			Fuel Type
			{fuelType}
			<AnalysisHeader />
			<HeatLoad />
			<WholeHomeUAComparison />
		</div>
	)
}
