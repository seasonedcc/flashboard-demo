import { db } from '~/db/db.server'

async function fetchSiteContent(keys: string[]) {
	const siteContent = await db()
		.selectFrom('siteContent')
		.select(['id', 'key', 'value'])
		.where('key', 'in', keys)
		.execute()

	// format siteContent so it returns an object with key-value pairs
	return siteContent.reduce(
		(acc, item) => {
			acc[item.key] = item.value
			return acc
		},
		{} as Record<string, string>
	)
}

export { fetchSiteContent }
