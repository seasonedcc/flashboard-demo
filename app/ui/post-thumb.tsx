import { Link, href } from 'react-router'
import { formatDate } from '~/helpers'
import type { Route } from '../routes/+types/blog'

function PostThumb({
	post,
}: { post: Route.ComponentProps['loaderData']['posts'][number] }) {
	return (
		<article className="flex max-w-xl flex-col items-start justify-between">
			<div className="flex items-center gap-x-4 text-xs">
				<time dateTime={post.createdAt.toISOString()} className="text-gray-500">
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
				<div className="prose">
					<section dangerouslySetInnerHTML={{ __html: post.content }} />
				</div>
			</div>
		</article>
	)
}

export { PostThumb }
