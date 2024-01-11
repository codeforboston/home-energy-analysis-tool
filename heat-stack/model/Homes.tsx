export class Home {
	livingArea!: number
	fuelType!: number
	designTemperatureOverride!: number
	heatingSystemEfficiency!: number
	thermostatSetPoint!: number
	setbackTemperature!: number
	setBackHoursPerDay!: number
	numberOfOccupants!: number
	estimatedWaterHeatingEfficiency!: number
	standByLosses!: number

	constructor(
		livingArea: number,
		fuelType: number,
		designTemperatureOverride: number,
		heatingSystemEfficiency: number,
		thermostatSetPoint: number,
		setbackTemperature: number,
		setBackHoursPerDay: number,
		numberOfOccupants: number,
		estimatedWaterHeatingEfficiency: number,
		standByLosses: number,
	) {
		this.livingArea = livingArea
		this.fuelType = fuelType
		this.designTemperatureOverride = designTemperatureOverride
		this.heatingSystemEfficiency = heatingSystemEfficiency
		this.thermostatSetPoint = thermostatSetPoint
		this.setbackTemperature = setbackTemperature
		this.setBackHoursPerDay = setBackHoursPerDay
		this.numberOfOccupants = numberOfOccupants
		this.estimatedWaterHeatingEfficiency = estimatedWaterHeatingEfficiency
		this.standByLosses = standByLosses
	}
}
