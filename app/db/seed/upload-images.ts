import { randomUUID } from 'node:crypto'
import { readFile, readdir, stat } from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client } from '@aws-sdk/client-s3'
import mime from 'mime'
import { env } from '~/env.server'
import { S3FileStorage } from './s3-storage'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imagesPath = path.join(__dirname, 'images')

const s3Client = new S3Client({
	endpoint: env().s3Endpoint,
	region: env().s3Region,
	credentials: {
		accessKeyId: env().s3AccessKeyId,
		secretAccessKey: env().s3SecretAccessKey,
	},
})

const storage = new S3FileStorage(
	s3Client,
	env().s3Endpoint,
	env().s3BucketName
)

type UploadedImageInfo = {
	flashboardStorage: 'v1'
	serviceName: 's3'
	bucketName: string
	key: string
	filename: string
	contentType: string
	size: number
}

async function uploadSeedImages(): Promise<Record<string, UploadedImageInfo>> {
	const files = await readdir(imagesPath)
	const uploaded: Record<string, UploadedImageInfo> = {}

	for (const filename of files) {
		const filepath = path.join(imagesPath, filename)
		const stats = await stat(filepath)
		if (!stats.isFile()) continue

		const contentType = mime.getType(filepath) ?? 'application/octet-stream'
		const key = randomUUID()
		const buffer = await readFile(filepath)
		const file = new File([buffer], filename, { type: contentType })

		await storage.set(key, file)

		uploaded[filename] = {
			flashboardStorage: 'v1',
			serviceName: 's3',
			bucketName: env().s3BucketName,
			key,
			filename,
			contentType,
			size: stats.size,
		}
	}

	return uploaded
}

export { uploadSeedImages }
