import { all, applySchema, map } from 'composable-functions'
import { z } from 'zod'
import { db } from '~/db/db.server'
import { parseImages } from './images.server'
import { sessionStorage } from './session.server'

/**
 * Fetches the cart ID from the session or creates a new cart in the database.
 */
async function getCartId(request: Request) {
	const cookieHeader = request.headers.get('Cookie')
	const session = await sessionStorage.getSession(cookieHeader)
	const currentCartId = session.get('currentCartId')
	// If the cart ID is already in the session, return it if it exists in the database
	if (currentCartId) {
		const cart = await db()
			.selectFrom('carts')
			.select('id')
			.where('id', '=', currentCartId)
			.executeTakeFirst()
		if (cart) return cart.id
	}
	// If the cart ID is not in the session or doesn't exist in the database, create a new cart
	const cart = await db()
		.insertInto('carts')
		.values({ userId: null })
		.returning('id')
		.executeTakeFirstOrThrow()
	// We return the cart ID to set it in the session in the root's loader
	return cart.id
}

/**
 * Fetches the cart information from the database by cart ID.
 * It includes the total count of items and the subtotal price.
 */
async function getCartInfo(cartId: string) {
	const lineItems = await db()
		.selectFrom('lineItems')
		.innerJoin('products', 'products.id', 'lineItems.productId')
		.select(['lineItems.quantity', 'products.priceCents'])
		.where('lineItems.cartId', '=', cartId)
		.execute()

	return {
		count: lineItems.reduce((sum, item) => sum + item.quantity, 0),
		subtotal: lineItems.reduce(
			(sum, item) => sum + item.quantity * item.priceCents,
			0
		),
	}
}

/**
 * Fetches the cart from the database by cart ID.
 * It includes the line items and their details.
 */
async function getCartItems(cartId: string) {
	const items = await db()
		.selectFrom('carts')
		.select(['carts.id as cartId'])
		.where('carts.id', '=', cartId)
		.leftJoin('lineItems', 'lineItems.cartId', 'carts.id')
		.leftJoin('products', 'products.id', 'lineItems.productId')
		.select([
			'lineItems.id as lineItemId',
			'lineItems.quantity',
			'products.id as productId',
			'products.name as productName',
			'products.stock',
			'products.priceCents',
			'products.images',
		])
		.execute()

	return items.map((item) => ({
		id: item.lineItemId,
		quantity: item.quantity ?? 0,
		product: {
			id: item.productId as string,
			name: item.productName as string,
			stock: item.stock ?? 0,
			priceCents: item.priceCents ?? 0,
			image: parseImages(item.images)[0],
		},
	}))
}

/**
 * Fetches the cart items and info then merges them into a single object.
 */
const getCurrentCart = map(
	all(getCartItems, getCartInfo),
	([lineItems, { count, subtotal }], id) => ({ id, lineItems, count, subtotal })
)

/**
 * Adds an item to the cart by product ID.
 * It enforces the input schema with zod.
 */
const addItemToCart = applySchema(
	z.object({ productId: z.string() }),
	z.string()
)(async ({ productId }, cartId) => {
	const lineItem = await db()
		.insertInto('lineItems')
		// It tries to insert a new line item into the database
		.values({ cartId, productId, quantity: 1 })
		// in case of conflict - when there's already a line item with the same cartId and productId
		.onConflict((oc) =>
			oc
				.columns(['cartId', 'productId'])
				// then increment the quantity of the existing line item
				.doUpdateSet({
					quantity: (eb) => eb('lineItems.quantity', '+', 1),
				})
		)
		.returning('id')
		.executeTakeFirstOrThrow()

	return lineItem.id
})

/**
 * Removes a line item from the cart by line item ID.
 */
const removeLineItem = applySchema(
	z.object({ lineItemId: z.string() }),
	z.string()
)(async ({ lineItemId }, cartId) => {
	const cart = await db()
		.deleteFrom('lineItems')
		.where('cartId', '=', cartId)
		.where('id', '=', lineItemId)
		.returning('cartId')
		.executeTakeFirstOrThrow()

	return cart.cartId
})

export { getCartId, getCartInfo, getCurrentCart, addItemToCart, removeLineItem }
