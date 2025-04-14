import { faker } from '@faker-js/faker'
import { db } from '~/db/db.server'

/**
 * Creates a dummy user in the database and returns the user ID.
 */
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
