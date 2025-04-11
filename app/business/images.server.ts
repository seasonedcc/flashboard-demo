import { href } from 'react-router'
import { z } from 'zod'
import { isJsonString } from '~/helpers'

const flashboardStorageFileSchema = z.object({
	serviceName: z.string(),
	bucketName: z.string(),
	key: z.string(),
	filename: z.string(),
	contentType: z.string(),
	size: z.number(),
})

const flashboardStorageDataSchema = z.array(flashboardStorageFileSchema)

type FlashboardStorageData = z.infer<typeof flashboardStorageDataSchema>
type FlashboardStorageFile = z.infer<typeof flashboardStorageFileSchema>

function getImageUrl(image: FlashboardStorageFile) {
	return href('/image/:bucketName/:key', {
		bucketName: image.bucketName,
		key: image.key,
	})
}

function parseImages(images: unknown) {
	if (typeof images === 'string' && isJsonString(images)) {
		return (
			flashboardStorageDataSchema
				.safeParse(JSON.parse(images))
				.data?.map(getImageUrl) ?? []
		)
	}
	if (Array.isArray(images)) {
		return (
			flashboardStorageDataSchema.safeParse(images).data?.map(getImageUrl) ?? []
		)
	}
	return []
}

export type { FlashboardStorageData, FlashboardStorageFile }
export { parseImages, getImageUrl }
