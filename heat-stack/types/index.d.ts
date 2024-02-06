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
