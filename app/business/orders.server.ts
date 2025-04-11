import { faker } from '@faker-js/faker'
import { applySchema } from 'composable-functions'
import { z } from 'zod'
import { db } from '~/db/db.server'

async function fetchOrder({ orderId }: { orderId: string }) {
	return db()
		.selectFrom('orders')
		.where('orders.id', '=', orderId)
		.leftJoin('users', 'users.id', 'orders.userId')
		.select(['orders.id', 'orders.totalCents', 'users.email'])
		.executeTakeFirstOrThrow()
}

const placeOrder = applySchema(
	z.any(),
	z.string()
)(async (_, cartId) =>
	db()
		.transaction()
		.execute(async (trx) => {
			const user = await trx
				.insertInto('users')
				.values({ email: faker.internet.email(), passwordHash: '123' })
				.returning('id')
				.executeTakeFirstOrThrow()

			const lineItems = await trx
				.selectFrom('lineItems')
				.innerJoin('products', 'products.id', 'lineItems.productId')
				.select(['lineItems.quantity', 'products.priceCents'])
				.where('lineItems.cartId', '=', cartId)
				.execute()

			if (lineItems.length === 0) throw new Error('Cart is empty')

			const totalCents = lineItems.reduce(
				(sum, item) => sum + item.quantity * item.priceCents,
				0
			)
			const order = await trx
				.insertInto('orders')
				.values({
					totalCents,
					userId: user.id,
					stripeResponse: JSON.stringify({
						id: `ch_cartId_${cartId}`,
						status: 'succeeded',
						amount: totalCents,
					}),
				})
				.returning('id')
				.executeTakeFirstOrThrow()

			await trx
				.deleteFrom('carts')
				.where('id', '=', cartId)
				.returning('id')
				.executeTakeFirstOrThrow()

			await trx.deleteFrom('lineItems').where('cartId', '=', cartId).execute()
			return order
		})
)

export { fetchOrder, placeOrder }
