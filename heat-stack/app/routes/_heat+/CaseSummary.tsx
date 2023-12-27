import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { Graphs } from '../../components/ui/heat/CaseSummaryComponents/Graphs.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'

export default function CaseSummary() {
	return (
		<main className="main-container">
			<div>
				<h1 className="page-title">Case Summary</h1>
				<HomeInformation />
				<CurrentHeatingSystem />
				<EnergyUseHistory />
				<Graphs />
			</div>
		</main>
	)
}
