import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '~/env.server'

const s3Client = new S3Client({
	endpoint: env().s3Endpoint,
	region: env().s3Region,
	credentials: {
		accessKeyId: env().s3AccessKeyId,
		secretAccessKey: env().s3SecretAccessKey,
	},
})

async function fetchFlashboardImageUrl({
	bucketName,
	key,
}: { bucketName: string; key: string }) {
	const command = new GetObjectCommand({ Bucket: bucketName, Key: key })

	command.input.ResponseContentDisposition = 'inline'
	const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 }) // 1 day

	return url.replace('digitaloceanspaces.com', 'cdn.digitaloceanspaces.com')
}

export { fetchFlashboardImageUrl }
