import { db } from '~/db/db.server'

async function fetchSiteContent(keys: string[]) {
	const siteContent = await db()
		.selectFrom('siteContent')
		.select(['id', 'key', 'value'])
		.where('key', 'in', keys)
		.execute()

	// format siteContent so it returns an object with key-value pairs
	const result: Record<string, string> = {}
	for (const item of siteContent) {
		result[item.key] = item.value
	}
	return result
}

export { fetchSiteContent }
