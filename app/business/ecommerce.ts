import { href } from 'react-router'
import { db } from '~/db/db.server'
import { flashboardStorageDataSchema } from '~/s3-client.server'

async function addImageUrlToProduct<T extends Record<string, unknown>>(
	product: T
) {
	const { images, ...rest } = product
	const parsedImages = flashboardStorageDataSchema.safeParse(images).data

	return {
		...rest,
		imagesSrc:
			parsedImages?.map((image) =>
				href('/image/:bucketName/:key', {
					bucketName: image.bucketName,
					key: image.key,
				})
			) ?? [],
	}
}

async function addImageUrlToProducts(
	products: {
		id: string
		name: string
		images: unknown
		description: string | null
		priceCents: number
	}[]
) {
	return Promise.all(
		products.map(async (product) => {
			return addImageUrlToProduct(product)
		})
	)
}

async function fetchTrendingProducts() {
	const products = await db()
		.selectFrom('products')
		.select(['id', 'name', 'images', 'description', 'priceCents'])
		.where('trending', '=', true)
		.orderBy('name', 'asc')
		.execute()

	return addImageUrlToProducts(products)
}

async function fetchProducts() {
	const products = await db()
		.selectFrom('products')
		.select(['id', 'name', 'images', 'description', 'priceCents'])
		.orderBy('name', 'asc')
		.execute()

	return addImageUrlToProducts(products)
}

async function fetchProduct(id: string) {
	const product = await db()
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
		.where('id', '=', id)
		.executeTakeFirst()

	if (!product) {
		return null
	}

	return addImageUrlToProduct(product)
}

export { fetchTrendingProducts, fetchProducts, fetchProduct }
