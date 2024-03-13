import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'
import { Button } from '#/app/components/ui/button.tsx'


export function EnergyUseHistory() {
	const titleClass = 'text-5xl font-extrabold tracking-wide mt-10'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	return (
		<div>
			<h2 className={`${titleClass}`}>Energy Use History</h2>
			<div>
				<h6 	<Button type="submit">Upload</Button>
			</div>
			<AnalysisHeader />
			<EnergyUseHistoryChart />
		</div>
	)
}
