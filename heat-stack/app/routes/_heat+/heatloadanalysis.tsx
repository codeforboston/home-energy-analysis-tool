import React from 'react'
import { type SummaryOutputSchema } from '#types/types.ts';
import { Graphs } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx'

interface HeatLoadAnalysisProps {
	heatLoadSummaryOutput: SummaryOutputSchema | undefined;
}

export default function HeatLoadAnalysis({
	heatLoadSummaryOutput,
}: HeatLoadAnalysisProps) {
	return <Graphs heatLoadSummaryOutput={heatLoadSummaryOutput} />
}
