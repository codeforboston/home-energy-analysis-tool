import { z } from 'zod';

export interface Case {
	firstName: string
	lastName: string
}

export interface HeatLoadAnalysis {
	rulesEngineVersion: string
	estimatedBalancePoint: number
	otherFuelUsage: number
	averageIndoorTemperature: number
	differenceBetweenTiAndTbp: number
	designTemperature: number
	wholeHomeHeatLossRate: number
	standardDeviationHeatLossRate: number
	averageHeatLoad: number
	maximumHeatLoad: number
}

export const HomeSchema = z.object({
 livingArea: z.number(),
 fuelType: z.enum(['Natural Gas','Oil','Propane']),
 designTemperatureOverride: z.number(),
 heatingSystemEfficiency: z.number(),
 thermostatSetPoint: z.number(),
 setbackTemperature: z.number(),
 setbackHoursPerDay: z.number(),
 numberOfOccupants: z.number(),
 estimatedWaterHeatingEfficiency: z.number(),
 standByLosses: z.number(),
});

export interface Home {
	livingArea: number
	fuelType: 'Natural Gas' | 'Oil' | 'Propane'
	designTemperatureOverride: number
	heatingSystemEfficiency: number
	thermostatSetPoint: number
	setbackTemperature: number
	setbackHoursPerDay: number
	numberOfOccupants: number
	estimatedWaterHeatingEfficiency: number
	standByLosses: number
}

export interface Location {
	address: string
	addressLine2: string
	city: string
	state: string
	zip: string
	country: string
}

export interface NaturalGasBill {
	provider: string
}

export interface NaturalGasBillRecord {
	periodStartDate: Date
	periodEndDate: Date
	usageTherms: number
	inclusionOverride: 'Include' | 'Do not include' | 'Include in other analysis'
}

export interface OilPropaneBill {
	provider: string
	precedingDeliveryDate: Date
}

export interface OilPropaneBillRecord {
	periodStartDate: Date
	periodEndDate: Date
	gallons: number
	inclusionOverride: 'Include' | 'Do not include' | 'Include in other analysis'
}
