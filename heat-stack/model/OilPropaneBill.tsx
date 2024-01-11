export class OilPropaneBill {
	provider!: number
	precedingDeliverDate!: Date

	constructor(provider: number, precedingDeliverDate: Date) {
		this.provider = provider
		this.precedingDeliverDate = precedingDeliverDate
	}
}
