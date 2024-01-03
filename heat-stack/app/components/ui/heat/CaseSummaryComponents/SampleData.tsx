import { type HomeModel } from '#models/Home.tsx'
import { type LocationModel } from '#models/Location.tsx'

let home: HomeModel = {
	first_name: 'Pietro',
	last_name: 'Schirano',
	livingArea: '3,000',
	designTemperature: '63',
	designTemperatureOverride: '65',
	fuelType: 'Natural Gas',
	heatingSystemEfficiency: '75',
	setPoint: '70',
	setbackTemperature: '65',
	setbackTime: '7',
}

let location: LocationModel = {
	street: '567 Pine Avenue Apt 21',
	city: 'Rivertown',
	state: 'MA',
	zip: '02856',
	country: 'United States of America',
}
