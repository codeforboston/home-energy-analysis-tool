import { z } from 'zod';

// JS team wants to discuss this name
export const Case = z.object({
	name: z.string()
})

export const HeatLoadAnalysis = z.object({
	rulesEngineVersion: z.string(),
	estimatedBalancePoint: z.number(),
	otherFuelUsage: z.number(),
	averageIndoorTemperature: z.number(),
	differenceBetweenTiAndTbp: z.number(),
	/**
	 * designTemperature in Fahrenheit
	 */
	designTemperature: z.number().max(-10).min(50),
	wholeHomeHeatLossRate: z.number(),
	standardDeviationHeatLossRate: z.number(),
	averageHeatLoad: z.number(),
	maximumHeatLoad: z.number(),
});

export const Home = z.object({
	/**
	 * unit: square feet
	 */
	living_area: z.number().min(500).max(10000),
	fuel_type: z.enum(['Natural Gas','Oil','Propane']),
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

export const Location = z.object({
	address: z.string(),
});

export const NaturalGasBill = z.object({
	provider: z.string(),
});

export const NaturalGasBillRecord = z.object({
	periodStartDate: z.date(),
	periodEndDate: z.date(),
	usageTherms: z.number(),
	inclusionOverride: z.enum(['Include', 'Do not include', 'Include in other analysis']),
});

export const OilPropaneBill = z.object({
	provider: z.string(),
	precedingDeliveryDate: z.date(),
});

export const OilPropaneBillRecord = z.object({
	periodStartDate: z.date(),
	periodEndDate: z.date(),
	gallons: z.number(),
	inclusionOverride: z.enum(['Include', 'Do not include', 'Include in other analysis']),
});
