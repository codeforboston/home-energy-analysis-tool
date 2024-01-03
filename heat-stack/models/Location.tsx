export class Location {
	street!: string
	city!: string
	state!: string
	zip!: string
	country!: string

	constructor(
		street: string,
		city: string,
		state: string,
		zip: string,
		country: string,
	) {
		this.street = street
		this.city = city
		this.state = state
		this.zip = zip
		this.country = country
	}
}
