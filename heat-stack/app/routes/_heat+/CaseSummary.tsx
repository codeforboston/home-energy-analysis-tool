import { CurrentHeatingSystem } from '../../components/ui/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/CaseSummaryComponents/EnergyUseHistory.tsx'
import { Graphs } from '../../components/ui/CaseSummaryComponents/Graphs.tsx'
import { HomeInformation } from '../../components/ui/CaseSummaryComponents/HomeInformation.tsx'

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
