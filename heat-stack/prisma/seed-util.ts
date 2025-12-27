import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

export function createPassword(password: string = faker.internet.password()) {
	return {
		hash: bcrypt.hashSync(password, 10),
	}
}
