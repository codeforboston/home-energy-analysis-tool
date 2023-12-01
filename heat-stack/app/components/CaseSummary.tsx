import { CurrentHeatingSystem } from './ui/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from './ui/CaseSummaryComponents/EnergyUseHistory.tsx'
import { Graphs } from './ui/CaseSummaryComponents/Graphs.tsx'
import { HomeInformation } from './ui/CaseSummaryComponents/HomeInformation.tsx'

export function CaseSummary() {
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
