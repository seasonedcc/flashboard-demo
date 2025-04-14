import { db } from '~/db/db.server'
import { parseImages } from './images.server'

// The array of keys that are used to fetch images from the database
const IMAGE_KEYS = ['homeHeroImage']

/**
 * Fetches site content from the database.
 * It only fetches the keys that are passed to it.
 */
function fetchSiteContent<const T extends string[]>(keys: T) {
	return async () => {
		const siteContent = await db()
			.selectFrom('siteContent')
			.select(['id', 'key', 'value'])
			.where('key', 'in', keys)
			.execute()

		// it turns an array of objects into an object merged by key
		return Object.fromEntries(
			siteContent.map(({ key, value }) => [
				key,
				// if the key is in IMAGE_KEYS, parse the images
				IMAGE_KEYS.includes(key) ? parseImages(value) : value,
			])
			// Types the return so the autocomplete suggests the keys
		) as Record<T[number], string>
	}
}

export { fetchSiteContent }
