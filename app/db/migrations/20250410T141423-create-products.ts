import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('products')
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('description', 'text')
		.addColumn('long_description', 'text')
		.addColumn('stock', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('price_cents', 'integer', (col) => col.notNull())
		.addColumn('images', 'jsonb', (col) => col.defaultTo(sql`'[]'::jsonb`))
		.addColumn('json_ld', 'jsonb', (col) => col.defaultTo(sql`'{}'::jsonb`))
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()

	await db.schema
		.createTable('carts')
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn('user_id', 'uuid', (col) =>
			col.references('users.id').onDelete('set null')
		)
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()

	await db.schema
		.createTable('line_items')
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn('cart_id', 'uuid', (col) =>
			col.references('carts.id').onDelete('cascade')
		)
		.addColumn('product_id', 'uuid', (col) =>
			col.references('products.id').onDelete('cascade')
		)
		.addColumn('quantity', 'integer', (col) => col.notNull())
		.addCheckConstraint('quantity_gt_0', sql`quantity > 0`)
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()

	await db.schema
		.createTable('orders')
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn('user_id', 'uuid', (col) =>
			col.references('users.id').onDelete('set null')
		)
		.addColumn('total_cents', 'integer', (col) => col.notNull())
		.addColumn('stripe_response', 'jsonb', (col) => col.notNull())
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('orders').execute()
	await db.schema.dropTable('line_items').execute()
	await db.schema.dropTable('carts').execute()
	await db.schema.dropTable('products').execute()
}
