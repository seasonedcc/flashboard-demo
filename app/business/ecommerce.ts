import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'
import { db } from '~/db/db.server'
import { getOrSetGlobal } from '~/db/globals'
import { env } from '~/env.server'

async function fetchFlashboardStorageUrl(client: S3Client, data: unknown) {
	const value = typeof data === 'string' ? JSON.parse(data) : data

	const { bucketName, key, contentType, filename } =
		fetchFlashboardStorageUrlSchema.parse(value)

	const command = new GetObjectCommand({
		Bucket: bucketName,
		Key: key,
	})

	// For images, set ResponseContentDisposition to inline for browser rendering
	// For other files, set to attachment for immediate download
	const encodedFilename = encodeURIComponent(filename)

	const disposition = contentType.startsWith('image/')
		? 'inline'
		: `attachment; filename="${encodedFilename}"`

	command.input.ResponseContentType = contentType
	command.input.ResponseContentDisposition = disposition

	// Generate a signed URL that's valid for 15 minutes
	return getSignedUrl(client, command, { expiresIn: 60 * 15 })
}

const fetchFlashboardStorageUrlSchema = z.object({
	bucketName: z.string(),
	key: z.string(),
	filename: z.string(),
	contentType: z.string(),
})

function s3Client() {
	return getOrSetGlobal(
		's3Client',
		() =>
			new S3Client({
				endpoint: env().s3Endpoint,
				region: env().s3Region,
				credentials: {
					accessKeyId: env().s3AccessKeyId,
					secretAccessKey: env().s3SecretAccessKey,
				},
			})
	)
}

async function addImageUrlToProduct(product: {
	id: string
	name: string
	images: unknown
	description: string | null
	priceCents: number
}) {
	const { images, ...rest } = product
	const parsedImages = z.array(z.unknown()).safeParse(images).data

	const imageSrc = parsedImages?.[0]
		? await fetchFlashboardStorageUrl(s3Client(), parsedImages[0])
		: null

	return {
		...rest,
		imageSrc,
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
		.select(['id', 'name', 'images', 'description', 'priceCents'])
		.where('id', '=', id)
		.executeTakeFirst()

	if (!product) {
		return null
	}

	return addImageUrlToProduct(product)
}

export { fetchTrendingProducts, fetchProducts, fetchProduct }
