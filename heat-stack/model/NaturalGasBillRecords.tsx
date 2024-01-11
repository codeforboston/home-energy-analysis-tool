export class NaturalGasBillRecords {
	provider!: number
	periodStartDate!: Date
	periodEndDate!: Date
	usageTherms!: number
	inclusionOverride!: number

	constructor(
		provider: number,
		periodStartDate: Date,
		periodEndDate: Date,
		usageTherms: number,
		inclusionOverride: number,
	) {
		this.provider = provider
		this.periodStartDate = periodStartDate
		this.periodEndDate = periodEndDate
		this.usageTherms = usageTherms
		this.inclusionOverride = inclusionOverride
	}
}
