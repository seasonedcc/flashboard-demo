import { fetchPosts } from '~/business/blog'
import { PostThumb } from '~/ui/post-thumb'
import type { Route } from './+types/blog'

export async function loader() {
	return { posts: await fetchPosts() }
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { posts } = loaderData
	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl">
					<h2 className="text-pretty font-semibold text-4xl text-gray-900 tracking-tight sm:text-5xl">
						From the blog
					</h2>
					<p className="mt-2 text-gray-600 text-lg/8">
						Learn how to grow your business with our expert advice.
					</p>
					<div className="mt-10 space-y-16 border-gray-200 border-t pt-10 sm:mt-16 sm:pt-16">
						{posts.map((post) => (
							<PostThumb post={post} key={post.id} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
