import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'

export function EnergyUseHistory() {
	const titleClassTailwind = 'text-5xl font-extrabold tracking-wide'
	return (
		<div>
			<h2 className={`${titleClassTailwind}`}>Energy Use History</h2>
			<AnalysisHeader />
			<EnergyUseHistoryChart />
		</div>
	)
}
