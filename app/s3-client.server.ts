import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'
import { getOrSetGlobal } from '~/db/globals'
import { env } from '~/env.server'

async function fetchFlashboardImageUrl({
	bucketName,
	key,
}: { bucketName: string; key: string }) {
	const command = new GetObjectCommand({
		Bucket: bucketName,
		Key: key,
	})

	command.input.ResponseContentDisposition = 'inline'
	return getSignedUrl(s3Client(), command, { expiresIn: 60 * 60 * 24 }) // 1 day
}

const fetchFlashboardStorageUrlSchema = z.object({
	bucketName: z.string(),
	key: z.string(),
	filename: z.string(),
	contentType: z.string(),
})

const flashboardStorageFileSchema = z.discriminatedUnion('flashboardStorage', [
	z.object({
		flashboardStorage: z.literal('v1'),
		serviceName: z.string(),
		bucketName: z.string(),
		key: z.string(),
		filename: z.string(),
		contentType: z.string(),
		size: z.number(),
	}),
])

const flashboardStorageDataSchema = z.array(flashboardStorageFileSchema)

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
				// needed for Supabase storage
				forcePathStyle: true,
			})
	)
}

export {
	fetchFlashboardStorageUrlSchema,
	fetchFlashboardImageUrl,
	flashboardStorageDataSchema,
	flashboardStorageFileSchema,
	s3Client,
}
