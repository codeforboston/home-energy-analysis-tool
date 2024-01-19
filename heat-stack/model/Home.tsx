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
