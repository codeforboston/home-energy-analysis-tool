export interface NaturalGasBillRecords {
	periodStartDate: Date
	periodEndDate: Date
	usageTherms: number
	inclusionOverride: 'Include' | 'Do not include' | 'Include in other analysis'
}
