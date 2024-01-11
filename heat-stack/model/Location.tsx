export class Location {
	address!: string
	address_line_2!: string
	city!: string
	state!: string
	zip!: string
	country!: string

	constructor(
		address: string,
		address_line_2: string,
		city: string,
		state: string,
		zip: string,
		country: string,
	) {
		this.address = address
		this.address_line_2 = address_line_2
		this.city = city
		this.state = state
		this.zip = zip
		this.country = country
	}
}
