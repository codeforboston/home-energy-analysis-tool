import React from 'react'
import { Graphs } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx'

interface HeatLoadAnalysisProps {
	heatLoadSummaryOutput: any;
	livingArea: number;
}

export default function HeatLoadAnalysis({
	heatLoadSummaryOutput,
	livingArea
}: HeatLoadAnalysisProps) {
	return <Graphs heatLoadSummaryOutput={heatLoadSummaryOutput} livingArea={livingArea} />
}
