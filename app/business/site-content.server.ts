import { db } from '~/db/db.server'
import { parseImages } from './images.server'

const IMAGE_KEYS = ['homeHeroImage']
function fetchSiteContent<const T extends string[]>(keys: T) {
	return async () => {
		const siteContent = await db()
			.selectFrom('siteContent')
			.select(['id', 'key', 'value'])
			.where('key', 'in', keys)
			.execute()

		return Object.fromEntries(
			siteContent.map(({ key, value }) => [
				key,
				IMAGE_KEYS.includes(key) ? parseImages(value) : value,
			])
		) as Record<T[number], string>
	}
}

export { fetchSiteContent }
