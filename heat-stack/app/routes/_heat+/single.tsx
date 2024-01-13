import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { Graphs } from '../../components/ui/heat/CaseSummaryComponents/Graphs.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'

export default function Inputs() {
	return (
		<div>
			{/* <div className="container items-center justify-between gap-4 md:h-24 md:flex-row"> */}
			<HomeInformation />
			<CurrentHeatingSystem />
			<EnergyUseHistory />
			<h1 className="page-title">Heat Load Analysis</h1>
			<Graphs />
		</div>
	)
}
