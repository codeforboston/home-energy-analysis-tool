export interface Home {
	livingArea: number
	fuelType: string // number?
	designTemperatureOverride: number
	heatingSystemEfficiency: number
	thermostatSetPoint: number
	setbackTemperature: number
	setBackHoursPerDay: number
	numberOfOccupants: number
	estimatedWaterHeatingEfficiency: number
	standByLosses: number
}
