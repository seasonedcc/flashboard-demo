import { Link, href } from 'react-router'
import { formatDate } from '~/helpers'
import type { Route } from '../routes/+types/blog'

function PostThumb({
	post,
}: { post: Route.ComponentProps['loaderData']['posts'][number] }) {
	return (
		<article className="flex max-w-xl flex-col items-start justify-between">
			<Link
				to={href('/blog/:slug', { slug: post.slug })}
				className="relative w-full"
			>
				<img
					alt={post.title}
					src={post.coverImageSrc[0]}
					className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
				/>
				<div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
			</Link>
			<div className="mt-8 flex items-center gap-x-4 text-xs">
				<time
					suppressHydrationWarning
					dateTime={post.createdAt.toISOString()}
					className="text-gray-500"
				>
					{formatDate(post.createdAt)}
				</time>
			</div>
			<div className="group relative">
				<h3 className="mt-3 font-semibold text-gray-900 text-lg/6 group-hover:text-gray-600">
					<Link to={href('/blog/:slug', { slug: post.slug })}>
						<span className="absolute inset-0" />
						{post.title}
					</Link>
				</h3>
			</div>
		</article>
	)
}

export { PostThumb }
