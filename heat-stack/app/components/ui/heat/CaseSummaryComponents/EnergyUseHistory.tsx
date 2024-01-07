import { HeatingLoadAnalysis } from '#models/HeatingLoadAnalysis.tsx'
import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'

export function EnergyUseHistory() {
	let heatingLoadAnalysis = new HeatingLoadAnalysis(
		'rules_engine_version?',
		'balance_point_initial?',
		'60.5',
		'1.07',
		'balance_point_sensitivity?',
		'63.5',
		'1,112',
		'5.52',
		'average_heat_load?',
		'maximum_heat_load?',
	)

	return (
		<div className="section-title">
			Energy Use History
			<AnalysisHeader />
			<EnergyUseHistoryChart />
		</div>
	)
}
