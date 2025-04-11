import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('blogPosts')
		.addColumn('coverImage', 'jsonb')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable('blogPosts').dropColumn('coverImage').execute()
}
