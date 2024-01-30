export interface OilPropaneBillRecord {
	periodStartDate: Date
	periodEndDate: Date
	gallons: number
	inclusionOverride: 'Include' | 'Do not include' | 'Include in other analysis'
}
