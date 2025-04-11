import { db } from '~/db/db.server'
import { sessionStorage } from './session.server'
import { parseImages } from './images.server'

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

async function getCart({ cartId }: { cartId: string }) {
	const cartWithItems = await db()
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

	const lineItems = cartWithItems
		.filter((item) => item.lineItemId !== null)
		.map((item) => ({
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

	return {
		id: cartId,
		count: lineItems.reduce((sum, item) => sum + item.quantity, 0),
		subtotal: lineItems.reduce(
			(sum, item) => sum + item.quantity * item.product.priceCents,
			0
		),
		lineItems,
	}
}

export { getCartId, getCart }
