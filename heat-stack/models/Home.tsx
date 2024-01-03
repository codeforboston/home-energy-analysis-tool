// https://www.tutorialsteacher.com/typescript/typescript-class

export class Home {
	first_name!: string
	last_name!: string
	livingArea!: string
	designTemperature!: string
	designTemperatureOverride!: string
	fuelType!: string
	heatingSystemEfficiency!: string
	setPoint!: string
	setbackTemperature!: string
	setbackTime!: string

	constructor(
		first_name: string,
		last_name: string,
		livingArea: string,
		designTemperature: string,
		designTemperatureOverride: string,
		fuelType: string,
		heatingSystemEfficiency: string,
		setPoint: string,
		setbackTemperature: string,
		setbackTime: string,
	) {
		this.first_name = first_name
		this.last_name = last_name
		this.livingArea = livingArea
		this.designTemperature = designTemperature
		this.designTemperatureOverride = designTemperatureOverride
		this.fuelType = fuelType
		this.heatingSystemEfficiency = heatingSystemEfficiency
		this.setPoint = setPoint
		this.setbackTemperature = setbackTemperature
		this.setbackTime = setbackTime
	}

	name(): string {
		return this.first_name + ' ' + this.last_name
	}
}
