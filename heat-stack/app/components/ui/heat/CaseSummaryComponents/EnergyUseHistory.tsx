import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'

export function EnergyUseHistory() {
	const titleClass = 'text-5xl font-extrabold tracking-wide mt-10'

	return (
		<div>
			<h2 className={`${titleClass}`}>Energy Use History</h2>
			<AnalysisHeader />
			<EnergyUseHistoryChart />
		</div>
	)
}
