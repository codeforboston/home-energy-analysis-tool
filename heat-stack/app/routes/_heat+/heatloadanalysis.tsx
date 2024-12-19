import React from 'react'
import { Graphs } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx'

interface HeatLoadAnalysisProps {
	heatLoadSummaryOutput: any;
	heatLoadBalancePoints: any;
}

export default function HeatLoadAnalysis({
	heatLoadSummaryOutput,
	heatLoadBalancePoints,
}: HeatLoadAnalysisProps) {
	return <Graphs heatLoadSummaryOutput={heatLoadSummaryOutput} heatLoadBalancePoints={heatLoadBalancePoints}/>
}
