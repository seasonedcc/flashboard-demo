import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('users')
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn('email', 'text', (col) => col.notNull().unique())
		.addColumn('password_hash', 'text', (col) => col.notNull())
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('users').execute()
}
