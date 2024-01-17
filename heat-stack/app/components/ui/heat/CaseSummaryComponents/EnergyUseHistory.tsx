import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'

export function EnergyUseHistory() {
	const titleClassTailwind = 'text-5xl font-extrabold tracking-wide'
	const componentMargin = 'mt-10'

	return (
		<div>
			<h2 className={`${titleClassTailwind} ${componentMargin}`}>
				Energy Use History
			</h2>
			<AnalysisHeader />
			<EnergyUseHistoryChart />
		</div>
	)
}
