import { db } from '~/db/db.server'
import { parseImages } from './images.server'

/**
 * Fetches all trending products from the database.
 */
async function fetchTrendingProducts() {
	const products = await db()
		.selectFrom('products')
		.select(['id', 'name', 'images', 'description', 'priceCents'])
		.where('trending', '=', true)
		.orderBy('name', 'asc')
		.execute()

	return products.map(({ images, ...product }) => ({
		...product,
		// Parses the images returning our inner image path for caching purposes
		imagesSrc: parseImages(images),
	}))
}

/**
 * Fetches all products from the database.
 */
async function fetchProducts() {
	const products = await db()
		.selectFrom('products')
		.select(['id', 'name', 'images', 'description', 'priceCents'])
		.orderBy('name', 'asc')
		.execute()

	return products.map(({ images, ...product }) => ({
		...product,
		// Parses the images returning our inner image path for caching purposes
		imagesSrc: parseImages(images),
	}))
}

/**
 * Fetches a single product from the database by product ID.
 */
async function fetchProduct({ productId }: { productId: string }) {
	const { images, ...product } = await db()
		.selectFrom('products')
		.select([
			'id',
			'name',
			'images',
			'description',
			'priceCents',
			'stock',
			'longDescription',
		])
		.where('id', '=', productId)
		.executeTakeFirstOrThrow()

	return { ...product, imagesSrc: parseImages(images) }
}

export { fetchTrendingProducts, fetchProducts, fetchProduct }
