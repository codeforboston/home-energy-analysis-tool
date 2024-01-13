export class Case {
	firstName!: string
	lastName!: string

	constructor(firstName: string, lastName: string) {
		this.firstName = firstName
		this.lastName = lastName
	}

	full_name(): string {
		return this.firstName + ' ' + this.lastName
	}
}
