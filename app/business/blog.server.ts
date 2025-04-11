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

async function fetchPost({ slug }: { slug: string }) {
	const post = await db()
		.selectFrom('blogPosts')
		.select(['id', 'title', 'slug', 'content', 'createdAt'])
		.where('slug', '=', slug)
		.where('state', '=', 'published')
		.executeTakeFirstOrThrow()

	return {
		...post,
		content: post.content as string,
	}
}

export { fetchPost, fetchPosts }
