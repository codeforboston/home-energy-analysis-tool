export class OilPropaneBillRecords {
	provider!: number
	periodStartDate!: Date
	periodEndDate!: Date
	gallons!: number
	inclusionOverride!: number

	constructor(
		provider: number,
		periodStartDate: Date,
		periodEndDate: Date,
		gallons: number,
		inclusionOverride: number,
	) {
		this.provider = provider
		this.periodStartDate = periodStartDate
		this.periodEndDate = periodEndDate
		this.gallons = gallons
		this.inclusionOverride = inclusionOverride
	}
}
