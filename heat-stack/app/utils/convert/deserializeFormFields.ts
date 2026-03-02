import { type BillingRecordsSchema } from '#types/types.ts'

// Returns a copy of the form object with string fields
// and coerces the fields their expected types 
// (e.g. numbers, dates) based on a predefined schema. This is useful for ensuring that the data is in the correct format before saving to the database or performing calculations.
export function deserializeFormData(form: any): any {
	if (!form) return form
	const result: any = { ...form }
	// Define expected types for fields
	const fieldTypes: Record<string, 'number' | 'date'> = {
		living_area: 'number',
		heating_system_efficiency: 'number',
		thermostat_set_point: 'number',
		setback_temperature: 'number',
		setback_hours_per_day: 'number',
		// Add more fields as needed
	}
	for (const key in fieldTypes) {
		if (result[key] !== undefined && result[key] !== null) {
			if (fieldTypes[key] === 'number' && typeof result[key] === 'string') {
				const n = Number(result[key])
				if (!isNaN(n)) result[key] = n
			}
			if (fieldTypes[key] === 'date' && typeof result[key] === 'string') {
				const d = new Date(result[key])
				if (!isNaN(d.getTime())) result[key] = d
			}
		}
	}

	// Special handling for billing_records JSON string
	if (typeof result.billing_records === 'string') {
			const bills = JSON.parse(result.billing_records) as BillingRecordsSchema
			result.billing_records = bills.map((bill: any) => {
				// Coerce bill fields
				if (typeof bill.usage === 'string') bill.usage = Number(bill.usage)
				if (typeof bill.period_start_date === 'string')
					bill.period_start_date = new Date(bill.period_start_date)
				if (typeof bill.period_end_date === 'string')
					bill.period_end_date = new Date(bill.period_end_date)
				if (typeof bill.whole_home_heat_loss_rate === 'string')
					bill.whole_home_heat_loss_rate = Number(
						bill.whole_home_heat_loss_rate,
					)
				// Add more bill field coercion as needed
				return bill
			})

	}
	return result
}
