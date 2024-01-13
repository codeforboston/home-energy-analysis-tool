export interface HeatLoadAnalysis {
	rules_engine_version: string
	estimatedBalancePoint: number
	otherFuelUsage: number
	averageIndoorTemperature: number
	differenceBetweenBAndTBP: number
	designTemperature: number
	wholeHomeHeatLossRate: number
	standardDeviationHeatLossRate: number
	averageHeatLoad: number
	maximumHeatLoad: number
}
