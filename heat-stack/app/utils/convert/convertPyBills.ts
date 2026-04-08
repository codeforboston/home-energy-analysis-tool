// Converts initially parsed gas bill records to the format expected by Python for the first time
export function convertPyBills(parsedRecords: any[]): any[] {
	return parsedRecords.map((record) => ({
		periodStartDate: new Date(record['period_start_date']),
		periodEndDate: new Date(record['period_end_date']),
		usageTherms: Number(record['usage_therms']),
		inclusionOverride: false,
	}))
}
