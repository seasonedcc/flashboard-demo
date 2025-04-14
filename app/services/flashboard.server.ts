import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '~/env.server'

// Instantiate the S3 client
const s3Client = new S3Client({
	endpoint: env().s3Endpoint,
	region: env().s3Region,
	credentials: {
		accessKeyId: env().s3AccessKeyId,
		secretAccessKey: env().s3SecretAccessKey,
	},
})

/**
 * Fetches a signed URL for an image stored in a DigitalOcean Space.
 *
 * @param bucketName - The name of the bucket where the image is stored.
 * @param key - The key (path) to the image in the bucket.
 * @returns - A promise that resolves to the signed URL of the image.
 */
async function fetchFlashboardImageUrl({
	bucketName,
	key,
}: { bucketName: string; key: string }) {
	const command = new GetObjectCommand({ Bucket: bucketName, Key: key })

	// Set the response content type and disposition to inline to display the image in the browser
	command.input.ResponseContentDisposition = 'inline'
	const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 }) // 1 day

	// Replace the domain in the URL to use the CDN and return the modified URL
	return url.replace('digitaloceanspaces.com', 'cdn.digitaloceanspaces.com')
}

export { fetchFlashboardImageUrl }
