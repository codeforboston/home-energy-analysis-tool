import { FieldMetadata, useForm } from '@conform-to/react'
import { Form } from '@remix-run/react'
import { ErrorList } from "./ErrorList.tsx"
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { Button } from '#/app/components/ui/button.tsx'

import { AnalysisHeader } from './AnalysisHeader.tsx'
import { EnergyUseHistoryChart } from './EnergyUseHistoryChart.tsx'


// type EnergyUseProps = {fields: any};

// export function EnergyUseHistory(props: EnergyUseProps) {
export function EnergyUseHistory() {
	const titleClass = 'text-5xl font-extrabold tracking-wide mt-10'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	return (
		<div>
			<h2 className={`${titleClass}`}>Energy Use History</h2>
			<div>
				<Button type="submit">Upload</Button>
			</div>
			<AnalysisHeader />
			<EnergyUseHistoryChart />
		</div>
	)
}
