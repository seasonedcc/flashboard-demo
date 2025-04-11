import { collect } from 'composable-functions'
import { href } from 'react-router'
import { fetchPost } from '~/business/blog.server'
import { formatDate } from '~/helpers'
import type { Route } from './+types/blog-post'
import { Breadcrumb } from '~/ui/breadcrumb'

export async function loader({ params }: Route.LoaderArgs) {
	const result = await collect({ post: fetchPost })(params)
	if (!result.success) throw new Response('Not Found', { status: 404 })

	return result.data
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { post } = loaderData
	return (
		<div className="bg-white">
			<div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
				<img
					alt={post.title}
					src={post.coverImageSrc[0]}
					className="-z-10 absolute inset-0 size-full object-cover opacity-20"
				/>
				<div
					aria-hidden="true"
					className="sm:-top-10 sm:-z-10 hidden sm:absolute sm:right-1/2 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
					/>
				</div>
				<div
					aria-hidden="true"
					className="-top-52 -z-10 -translate-x-1/2 absolute left-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
					/>
				</div>
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<Breadcrumb
							dark
							links={[
								{ name: 'Home', href: href('/') },
								{ name: 'Blog', href: href('/blog') },
							]}
						/>
						<h2 className="mt-2 font-semibold text-5xl text-white tracking-tight sm:text-7xl">
							{post.title}
						</h2>
					</div>
				</div>
			</div>
			<article className="mx-auto mt-8 max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl">
					<div className="mt-4 flex items-center gap-x-4 text-xs">
						<time
							dateTime={post.createdAt.toLocaleTimeString()}
							className="text-gray-500"
							suppressHydrationWarning
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
