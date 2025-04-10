import { db } from '~/db/db.server'

async function fetchPosts() {
	const posts = await db()
		.selectFrom('blogPosts')
		.select(['id', 'title', 'slug', 'content', 'createdAt'])
		.where('state', '=', 'published')
		.orderBy('createdAt', 'desc')
		.execute()

	return posts.map((post) => ({
		...post,
		content: post.content as string,
	}))
}

export { fetchPosts }
