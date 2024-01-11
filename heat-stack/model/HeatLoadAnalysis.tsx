export class HeatingLoadAnalysis {
	rules_engine_version!: string
	estimatedBalancePoint!: number
	otherFuelUsage!: number
	averageIndoorTemperature!: number
	differenceBetweenBAndTBP!: number
	designTemperature!: number
	wholeHomeHeatLossRate!: number
	standardDeviationHeatLossRate!: number
	averageHeatLoad!: number
	maximumHeatLoad!: number

	constructor(
		rules_engine_version: string,
		estimatedBalancePoint: number,
		otherFuelUsage: number,
		averageIndoorTemperature: number,
		differenceBetweenBAndTBP: number,
		designTemperature: number,
		wholeHomeHeatLossRate: number,
		standardDeviationHeatLossRate: number,
		averageHeatLoad: number,
		maximumHeatLoad: number,
	) {
		this.rules_engine_version = rules_engine_version
		this.estimatedBalancePoint = estimatedBalancePoint
		this.otherFuelUsage = otherFuelUsage
		this.averageIndoorTemperature = averageIndoorTemperature
		this.differenceBetweenBAndTBP = differenceBetweenBAndTBP
		this.designTemperature = designTemperature
		this.wholeHomeHeatLossRate = wholeHomeHeatLossRate
		this.standardDeviationHeatLossRate = standardDeviationHeatLossRate
		this.averageHeatLoad = averageHeatLoad
		this.maximumHeatLoad = maximumHeatLoad
	}
}
