// heat-stack/app/components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx
import { SummaryOutputSchema } from '#types/types.ts';
import { HeatLoad } from './Graphs/HeatLoad.tsx'
import { WholeHomeUAComparison } from './Graphs/WholeHomeUAComparison.tsx'

interface GraphsProps {
	heatLoadSummaryOutput: SummaryOutputSchema;
	livingArea: number;
}

export function HeatLoadAnalysis({ heatLoadSummaryOutput, livingArea }: GraphsProps) {
	const fuel_type = 'Natural Gas'
	const componentMargin = 'mt-10'
	return (
		<div>
			<HeatLoad heatLoadSummaryOutput={heatLoadSummaryOutput} />
			<WholeHomeUAComparison  heatLoadSummaryOutput={heatLoadSummaryOutput} livingArea={livingArea} />
		</div>
	)
}
