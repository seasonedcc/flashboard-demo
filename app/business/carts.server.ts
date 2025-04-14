import { all, applySchema, map } from 'composable-functions'
import { z } from 'zod'
import { db } from '~/db/db.server'
import { parseImages } from './images.server'
import { sessionStorage } from './session.server'

async function getCartId(request: Request) {
	const cookieHeader = request.headers.get('Cookie')
	const session = await sessionStorage.getSession(cookieHeader)
	const currentCartId = session.get('currentCartId')
	if (currentCartId) {
		const cart = await db()
			.selectFrom('carts')
			.select('id')
			.where('id', '=', currentCartId)
			.executeTakeFirst()
		if (cart) return cart.id
	}
	const cart = await db()
		.insertInto('carts')
		.values({ userId: null })
		.returning('id')
		.executeTakeFirstOrThrow()
	return cart.id
}

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

const getCurrentCart = map(
	all(getCartItems, getCartInfo),
	([lineItems, { count, subtotal }], id) => ({ id, lineItems, count, subtotal })
)

const addItemToCart = applySchema(
	z.object({ productId: z.string() }),
	z.string()
)(async ({ productId }, cartId) => {
	const lineItem = await db()
		.insertInto('lineItems')
		.values({ cartId, productId, quantity: 1 })
		.onConflict((oc) =>
			oc
				.columns(['cartId', 'productId'])
				.doUpdateSet({
					quantity: (eb) => eb('lineItems.quantity', '+', 1),
				})
		)
		.returning('id')
		.executeTakeFirstOrThrow()

	return lineItem.id
})

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
