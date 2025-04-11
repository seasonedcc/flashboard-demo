import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('line_items')
		.addUniqueConstraint('line_items_cart_product', ['cartId', 'productId'])
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('line_items')
		.dropConstraint('line_items_cart_product')
		.execute()
}
