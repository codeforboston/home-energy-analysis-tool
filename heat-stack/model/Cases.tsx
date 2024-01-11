export class Case {
	first_name!: string
	last_name!: string

	constructor(first_name: string, last_name: string) {
		this.first_name = first_name
		this.last_name = last_name
	}

	full_name(): string {
		return this.first_name + ' ' + this.last_name
	}
}
