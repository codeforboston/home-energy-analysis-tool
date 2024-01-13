import { AnalysisHeader } from './AnalysisHeader.tsx'
import { HeatLoad } from './Graphs/HeatLoad.tsx'
import { StandardDeviationOfUA } from './Graphs/StandardDeviationOfUA.tsx'
import { WholeHomeUAComparison } from './Graphs/WholeHomeUAComparison.tsx'

export function Graphs() {
	const fuelType = 'Natural Gas'
	return (
		<div className="section-title">
			Fuel Type <br />
			{fuelType}
			<AnalysisHeader />
			<hr />
			<HeatLoad />
			<WholeHomeUAComparison />
			<StandardDeviationOfUA />
		</div>
	)
}
