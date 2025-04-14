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

/**
 * Generates a URL for the image based on the bucket name and key.
 * the URL is the path to our inner resource route that handles the image caching.
 */
function getImageUrl(image: FlashboardStorageFile) {
	return href('/image/:bucketName/:key', {
		bucketName: image.bucketName,
		key: image.key,
	})
}

/**
 * Parses the images from the database.
 * It can be a JSON string or an array of objects.
 * It returns an array of URLs for the images.
 */
function parseImages(images: unknown) {
	// once the shape of images is detected it will try to parse the images if they correspond to the Flashboard schema
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
