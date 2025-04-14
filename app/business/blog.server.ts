import { db } from '~/db/db.server'
import { parseImages } from './images.server'

/**
 * Fetches all published blog posts from the database.
 */
async function fetchPosts() {
	const posts = await db()
		.selectFrom('blogPosts')
		.select(['id', 'title', 'slug', 'content', 'createdAt', 'coverImage'])
		.where('state', '=', 'published')
		.orderBy('createdAt', 'desc')
		.execute()

	// Parses the images and casts the title and content to strings because we know they will be present when the state is 'published'
	return posts.map(({ coverImage, ...post }) => ({
		...post,
		title: post.title as string,
		content: post.content as string,
		coverImageSrc: parseImages(coverImage),
	}))
}

/**
 * Fetches a single published blog post from the database by slug.
 */
async function fetchPost({ slug }: { slug: string }) {
	const { coverImage, ...post } = await db()
		.selectFrom('blogPosts')
		.select(['id', 'title', 'slug', 'content', 'createdAt', 'coverImage'])
		.where('slug', '=', slug)
		.where('state', '=', 'published')
		.executeTakeFirstOrThrow()

	return {
		...post,
		title: post.title as string,
		content: post.content as string,
		coverImageSrc: parseImages(coverImage),
	}
}

export { fetchPost, fetchPosts }
