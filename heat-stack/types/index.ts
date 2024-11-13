import { number, z } from 'zod';
export type NaturalGasUsageDataSchema = z.infer<typeof naturalGasUsageSchema>;

// JS team wants to discuss this name
export const CaseSchema = z.object({
	name: z.string()
})

export const HomeSchema = z.object({
	/**
	 * unit: square feet
	 */
	living_area: z.number().min(500).max(10000),
	fuel_type: z.enum(['GAS','OIL','PROPANE']),
	design_temperature_override: z.number().optional(),
	/**
	 * unit: percentage in decimal numbers, but not 0 to 1
	 */
	heating_system_efficiency: z.number().min(60).max(100),
	thermostat_set_point: z.number(),
	setback_temperature: z.number().optional(),
	setback_hours_per_day: z.number().optional(),
	numberOfOccupants: z.number(),
	estimatedWaterHeatingEfficiency: z.number(),
	standByLosses: z.number(),
});

export const TableSchema = z.object({
	usage_data_with_user_adjustments: z.string().optional(),
});

export const LocationSchema = z.object({
	address: z.string(),
});

// Not used
// export const NaturalGasBill = z.object({
// 	provider: z.string(),
// });


// Not used
// export const OilPropaneBill = z.object({
// 	provider: z.string(),
// 	precedingDeliveryDate: z.date(),
// });

// Not used
// export const OilPropaneBillRecord = z.object({
// 	periodStartDate: z.date(),
// 	periodEndDate: z.date(),
// 	gallons: z.number(),
// 	inclusionOverride: z.enum(['Include', 'Do not include', 'Include in other analysis']),
// });

// Define the schema for balance records
export const balancePointGraphRecordSchema = z.object({
	balance_point: z.number(),
	heat_loss_rate: z.number(),
	change_in_heat_loss_rate: z.number(),
	percent_change_in_heat_loss_rate: z.number(),
	standard_deviation: z.number(),
})

//   Define the schema for the balance point graph
export const balancePointGraphSchema = z.object({
	records: z.array(balancePointGraphRecordSchema),
})

// Define the schema for the 'summary_output' key
export const summaryOutputSchema = z.object({
	// rulesEngineVersion: z.string(), // TODO
	estimated_balance_point: z.number(),
	other_fuel_usage: z.number(),
	average_indoor_temperature: z.number(),
	difference_between_ti_and_tbp: z.number(),
	/**
	 * designTemperature in Fahrenheit
	 */
	design_temperature: z.number().max(50).min(-50),
	whole_home_heat_loss_rate: z.number(),
	standard_deviation_of_heat_loss_rate: z.number(),
	average_heat_load: z.number(),
	maximum_heat_load: z.number(),
});

export const NaturalGasBillRecord = z.object({
	periodStartDate: z.date(),
	periodEndDate: z.date(),
	usageTherms: z.number(),
	inclusionOverride: z.number(),
	// inclusionOverride: z.enum(["Include", "Do not include", "Include in other analysis"]),
});
  
// Helper function to create a date string schema
const dateStringSchema = () =>
	z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD')

export const naturalGasUsageSchema = z.map(
	z.enum(['overall_start_date', 'overall_end_date', 'records']),
	z.union([dateStringSchema(), z.array(NaturalGasBillRecord)]),
)

// Define the schema for one billing record
export const oneBillingRecordSchema = z.object({
	period_start_date: z.string(),
	period_end_date: z.string(),
	usage: z.number(),
	/** Ask the rules engine if this is an enum:
	z.enum(["Include", "Do not include", "Include in other analysis"]),
	What does "Include in other analysis" mean?
	Keep this as default `false`? */
	inclusion_override: z.boolean(),
	/**
	 * ALLOWED_HEATING_USAGE is for winter — red
	 * 
	 * ALLOWED_NON_HEATING_USAGE is for summer — blue
	 * 
	 * NOT_ALLOWED_IN_CALCULATIONS is for "shoulder" months/seasons — crossed out
	 */
	// analysis_type: z.enum(["ALLOWED_HEATING_USAGE", "ALLOWED_NON_HEATING_USAGE", "NOT_ALLOWED_IN_CALCULATIONS"]),
	analysis_type: z.number(),
	default_inclusion: z.boolean(),
	eliminated_as_outlier: z.boolean(),
	whole_home_heat_loss_rate: z.number(),
});

// Define the schema for the 'billing_records' list
export const allBillingRecordsSchema = z.array(oneBillingRecordSchema);

//   Define the schema for the 'usage_data' key
export const usageDataSchema = z.object({
	summary_output: summaryOutputSchema,
	balance_point_graph: balancePointGraphSchema,
	billing_records: allBillingRecordsSchema,
})
