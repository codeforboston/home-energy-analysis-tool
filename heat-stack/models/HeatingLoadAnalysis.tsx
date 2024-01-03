// https://www.tutorialsteacher.com/typescript/typescript-class

export class HeatingLoadAnalysis {
	version_rules_engine!: string
	balance_point_initial!: string
	balancePoint!: string
	dailyOtherUsage!: string
	balance_point_sensitivity!: string
	averageIndoorTemperature!: string
	wholeHomeUA!: string
	standardDevationUA!: string
	average_heat_load!: string
	maximum_heat_load!: string

	constructor(
		version_rules_engine: string,
		balance_point_initial: string,
		balancePoint: string,
		dailyOtherUsage: string,
		balance_point_sensitivity: string,
		averageIndoorTemperature: string,
		wholeHomeUA: string,
		standardDevationUA: string,
		average_heat_load: string,
		maximum_heat_load: string,
	) {
		this.version_rules_engine = version_rules_engine
		this.balance_point_initial = balance_point_initial
		this.balancePoint = balancePoint
		this.dailyOtherUsage = dailyOtherUsage
		this.balance_point_sensitivity = balance_point_sensitivity
		this.averageIndoorTemperature = averageIndoorTemperature
		this.wholeHomeUA = wholeHomeUA
		this.standardDevationUA = standardDevationUA
		this.average_heat_load = average_heat_load
		this.maximum_heat_load = maximum_heat_load
	}
}
