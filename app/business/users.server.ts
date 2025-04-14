import { faker } from '@faker-js/faker'
import { db } from '~/db/db.server'

async function createDummyUser() {
	return db()
		.insertInto('users')
		.values({
			email: faker.internet.email().toLowerCase(),
			passwordHash: faker.internet.password(),
		})
		.returning('id')
		.executeTakeFirstOrThrow()
}

export { createDummyUser }
