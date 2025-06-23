import { type CaseInfo, Schema } from '#app/routes/_heat+/single.tsx'
import { type SubmissionResult } from '#node_modules/@conform-to/react'
import {
	type BalancePointGraphSchema,
	type BillingRecordsSchema,
	type SummaryOutputSchema,
	type UsageDataSchema,
} from '#types/types.ts'

export function objectToString(obj: any): any {
	// !!!! typeof obj has rules for zodObjects
	// typeof obj returns the type of the value of that zod object (boolean, object, etc)
	// JSON.stringify of a Zod object is the value of that Zod object, except for null / undefined
	if (!obj) {
		return 'none'
	} else if (typeof obj !== 'object') {
		return JSON.stringify(obj)
	} else if (Array.isArray(obj)) {
		return `[${obj
			.map((value) => {
				return objectToString(value)
			})
			.join(', ')}]`
	}

	const retval = `{ ${Object.entries(obj)
		.map(([key, value]) => `"${key}": ${objectToString(value)}`)
		.join(', ')} }`
	return retval as any
}

/**
 * replace original Rules Engine's billing records with new UI's billingRecords
 * @param parsedLastResult
 * @param processedEnergyBills
 */
export const buildCurrentMapOfUsageData = (
	parsedLastResult: Map<any, any>,
	processedEnergyBills: BillingRecordsSchema,
) => {
	// make a copy of parsedLastResult
	const copyOfParsedLastResult: Map<any, any> | undefined =
		structuredClone(parsedLastResult)

	const billMap: Array<Map<string, any>> = processedEnergyBills.map((bill) => {
		return new Map(Object.entries(bill))
	})

	// const processedEnergyBillsWithMaps = change records from objects to maps in processedEnergyBills using the same key values,
	//   and order matters (maybe)

	copyOfParsedLastResult.set('processed_energy_bills', billMap)
	return copyOfParsedLastResult
}

/**
 * Builds the current usage data based on the parsed last result.
 * @param parsedLastResult - The parsed last result.
 * @returns The current usage data.
 */
export const buildCurrentUsageData = (
	parsedLastResult: Map<any, any>,
): UsageDataSchema => {
	const newUsageData = {
		heat_load_output: Object.fromEntries(
			parsedLastResult?.get('heat_load_output'),
		) as SummaryOutputSchema,
		balance_point_graph: Object.fromEntries(
			parsedLastResult?.get('balance_point_graph'),
		) as BalancePointGraphSchema,
		processed_energy_bills: parsedLastResult
			?.get('processed_energy_bills')
			.map((map: any) => Object.fromEntries(map)) as BillingRecordsSchema,
	} as UsageDataSchema

	// typecasting as UsageDataSchema because the types here do not quite line up coming from parsedLastResult as Map<any, any> - might need to think about how to handle typing the results from the python output more strictly
	// Type '{ heat_load_output: { [k: string]: any; }; balance_point_graph: { [k: string]: any; }; processed_energy_bills: any; }' is not assignable to type '{ heat_load_output: { estimated_balance_point: number; other_fuel_usage: number; average_indoor_temperature: number; difference_between_ti_and_tbp: number; design_temperature: number; whole_home_heat_loss_rate: number; standard_deviation_of_heat_loss_rate: number; average_heat_load: number; maximum_heat_load: number...'.
	return newUsageData
}

type ActionResult =
	| (SubmissionResult<string[]> & { caseInfo?: CaseInfo })
	| ({ data: string } & { caseInfo?: CaseInfo })
	| undefined

/** typeguard for useAction between string[] and {data: string} */
export function hasDataProperty(
	result: ActionResult,
): result is { data: string } {
	return (
		result !== undefined &&
		'data' in result &&
		typeof (result as any).data === 'string'
	)
}
interface HasParsedAndValidatedFormSchema {
	parsedAndValidatedFormSchema: unknown
}
export function hasParsedAndValidatedFormSchemaProperty(
	value: unknown,
): value is HasParsedAndValidatedFormSchema {
	if (
		!(
			value !== null &&
			typeof value === 'object' &&
			'parsedAndValidatedFormSchema' in value
		)
	) {
		return false
	}

	return Schema.safeParse(value.parsedAndValidatedFormSchema).success
}
