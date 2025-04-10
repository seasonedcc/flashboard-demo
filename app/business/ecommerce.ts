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

async function trendingProducts() {
	const products = await db()
		.selectFrom('products')
		.select(['id', 'name', 'images', 'description', 'priceCents'])
		.execute()
	return Promise.all(
		products.map(async (product) => {
			const { images, ...rest } = product
			const firstImage = z.array(z.unknown()).safeParse(images)
			return {
				...rest,
				imageSrc: await fetchFlashboardStorageUrl(s3Client(), firstImage),
			}
		})
	)
}

export { trendingProducts }
