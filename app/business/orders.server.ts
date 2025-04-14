import { faker } from '@faker-js/faker'
import { applySchema, withContext } from 'composable-functions'
import { z } from 'zod'
import { db } from '~/db/db.server'
import { createDummyUser } from './users.server'
import { getCartInfo } from './carts.server'

/**
 * Fetches an order from the database by orderId.
 */
async function fetchOrder({ orderId }: { orderId: string }) {
	return db()
		.selectFrom('orders')
		.where('orders.id', '=', orderId)
		.leftJoin('users', 'users.id', 'orders.userId')
		.select(['orders.id', 'orders.totalCents', 'users.email'])
		.executeTakeFirstOrThrow()
}

/**
 * Places an order by creating a dummy user and an order in the database.
 * It also deletes the cart and line items from the database.
 */
const placeOrder = withContext.pipe(
	createDummyUser,
	applySchema(
		z.object({ id: z.string() }),
		z.string()
	)(async ({ id: userId }, cartId) => {
		const { subtotal } = await getCartInfo(cartId)
		return (
			db()
				// Uses a DB transaction to ensure that all operations succeed or none do
				.transaction()
				.execute(async (trx) => {
					// Creates the order for the dummy user
					const order = await trx
						.insertInto('orders')
						.values({
							totalCents: subtotal,
							userId,
							stripeResponse: JSON.stringify({
								id: `ch_cartId_${cartId}`,
								status: 'succeeded',
								amount: subtotal,
							}),
						})
						.returning('id')
						.executeTakeFirstOrThrow()

					// Deletes the cart and line items from the database
					await trx
						.deleteFrom('carts')
						.where('id', '=', cartId)
						.returning('id')
						.executeTakeFirstOrThrow()

					await trx
						.deleteFrom('lineItems')
						.where('cartId', '=', cartId)
						.execute()
					return order
				})
		)
	})
)

export { fetchOrder, placeOrder }
