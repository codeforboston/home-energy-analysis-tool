import React from 'react'
import { Graphs } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx'

interface HeatLoadAnalysisProps {
	heatLoadSummaryOutput: any;
}

export default function HeatLoadAnalysis({
	heatLoadSummaryOutput,
}: HeatLoadAnalysisProps) {
	return <Graphs heatLoadSummaryOutput={heatLoadSummaryOutput} />
}
