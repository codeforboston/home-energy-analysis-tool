export class EnergyUsePeriodModel {
	includeData!: boolean
	startDate!: string
	endDate!: string
	usageQuantity!: string

	constructor(
		includeData: boolean,
		startDate: string,
		endDate: string,
		usageQuantity: string,
	) {
		this.includeData! = includeData!
		this.startDate = startDate
		this.endDate = endDate
		this.usageQuantity = usageQuantity
	}
}
