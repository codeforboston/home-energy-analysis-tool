import { AnalysisHeader } from './AnalysisHeader.tsx'
import { HeatLoad } from './Graphs/HeatLoad.tsx'
import { WholeHomeUAComparison } from './Graphs/WholeHomeUAComparison.tsx'

export function Graphs() {
	const fuel_type = 'Natural Gas'
	const titleClassTailwind = 'text-5xl font-extrabold tracking-wide'
	const componentMargin = 'mt-10'
	return (
		<div>
			<h2 className={`${titleClassTailwind} ${componentMargin}`}>
				Heat Load Analysis
			</h2>
			Fuel Type
			{fuel_type}
			<AnalysisHeader />
			<HeatLoad />
			<WholeHomeUAComparison />
		</div>
	)
}
