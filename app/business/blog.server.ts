import { db } from '~/db/db.server'
import { parseImages } from './images.server'

async function fetchPosts() {
	const posts = await db()
		.selectFrom('blogPosts')
		.select(['id', 'title', 'slug', 'content', 'createdAt', 'coverImage'])
		.where('state', '=', 'published')
		.orderBy('createdAt', 'desc')
		.execute()

	return posts.map(({ coverImage, ...post }) => ({
		...post,
		title: post.title as string,
		content: post.content as string,
		coverImageSrc: parseImages(coverImage),
	}))
}

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
