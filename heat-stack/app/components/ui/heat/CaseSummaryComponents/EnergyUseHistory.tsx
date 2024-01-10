import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'

export function EnergyUseHistory() {
	return (
		<div className="section-title">
			Energy Use History
			<AnalysisHeader />
			<EnergyUseHistoryChart />
		</div>
	)
}
