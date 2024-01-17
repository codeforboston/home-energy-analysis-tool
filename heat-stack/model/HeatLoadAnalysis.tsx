export interface HeatLoadAnalysis {
	rulesEngineVersion: string
	estimatedBalancePoint: number
	otherFuelUsage: number
	averageIndoorTemperature: number
	differenceBetweenTiAndTbp: number
	designTemperature: number
	wholeHomeHeatLossRate: number
	standardDeviationHeatLossRate: number
	averageHeatLoad: number
	maximumHeatLoad: number
}
