import { Home } from '#models/Home.tsx'
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { HeatLoad } from './Graphs/HeatLoad.tsx'
import { WholeHomeUAComparison } from './Graphs/WholeHomeUAComparison.tsx'

export function Graphs() {
	let home = new Home(
		'Pietro',
		'Schirano',
		'3,000',
		'63',
		'65',
		'Natural Gas',
		'75',
		'70',
		'65',
		'7',
	)
	return (
		<div className="section-title">
			Fuel Type
			<br />
			<div className="item-big">{home.fuelType}</div> <br />
			<AnalysisHeader />
			<HeatLoad />
			<WholeHomeUAComparison />
		</div>
	)
}
