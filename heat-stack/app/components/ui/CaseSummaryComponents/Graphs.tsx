import { HeatLoad } from './Graphs/HeatLoad.tsx'
import { StandardDeviationOfUA } from './Graphs/StandardDeviationOfUA.tsx'
import { WholeHomeUAComparison } from './Graphs/WholeHomeUAComparison.tsx'

export function Graphs() {
	return (
		<div className="section-title">
			Graphs
			<hr />
			<HeatLoad />
			<WholeHomeUAComparison />
			<StandardDeviationOfUA />
		</div>
	)
}
