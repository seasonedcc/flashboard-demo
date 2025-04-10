import { Link, href } from 'react-router'
import { fetchPost } from '~/business/blog'
import { formatDate } from '~/helpers'
import type { Route } from './+types/blog-post'

export async function loader({ params }: Route.LoaderArgs) {
	const post = await fetchPost(params.slug)
	return { post }
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { post } = loaderData
	return (
		<div className="bg-white py-24 sm:py-32">
			<article className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl">
					<nav aria-label="Breadcrumb" className="mx-0.5">
						<ol className="flex items-center space-x-2">
							<li>
								<div className="flex items-center text-sm">
									<Link
										to={href('/')}
										className="font-medium text-gray-500 hover:text-gray-900"
									>
										Home
									</Link>
									<svg
										fill="currentColor"
										viewBox="0 0 20 20"
										aria-hidden="true"
										className="ml-2 size-5 shrink-0 text-gray-300"
									>
										<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
									</svg>
								</div>
							</li>
							<li>
								<div className="flex items-center text-sm">
									<Link
										to={href('/blog')}
										className="font-medium text-gray-500 hover:text-gray-900"
									>
										Blog
									</Link>
								</div>
							</li>
						</ol>
					</nav>
					<h2 className="mt-4 text-pretty font-semibold text-4xl text-gray-900 tracking-tight sm:text-5xl">
						{post.title}
					</h2>
					<div className="mt-4 flex items-center gap-x-4 text-xs">
						<time
							dateTime={post.createdAt.toLocaleTimeString()}
							className="text-gray-500"
						>
							{formatDate(post.createdAt)}
						</time>
					</div>
					<section
						key={post.id}
						className="mt-4 flex max-w-xl flex-col items-start justify-between sm:mt-8"
					>
						<div
							className="prose prose-sm mt-5 text-gray-600"
							dangerouslySetInnerHTML={{ __html: post.content }}
						/>
					</section>
				</div>
			</article>
		</div>
	)
}
