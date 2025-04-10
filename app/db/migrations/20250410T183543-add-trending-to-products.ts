import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('products')
		.addColumn('trending', 'boolean', (col) => col.defaultTo(false))
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable('products').dropColumn('trending').execute()
}
