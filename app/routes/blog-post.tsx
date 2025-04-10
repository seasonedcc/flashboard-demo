import { Link, href } from 'react-router'
import type { Route } from './+types/blog-post'

export async function loader() {
	const post = {
		id: 1,
		title: 'Boost your conversion rate',
		slug: 'boost-your-conversion-rate',
		categories: 'Marketing',
		body: 'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.',
		date: 'Mar 16, 2020',
		datetime: '2020-03-16',
		author: {
			name: 'Michael Foster',
			role: 'Co-Founder / CTO',
			imageUrl:
				'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
	}
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
						<time dateTime={post.datetime} className="text-gray-500">
							{post.date}
						</time>
						{post.categories.split(',').map((category) => (
							<span
								key={category.trim()}
								className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600"
							>
								{category.trim()}
							</span>
						))}
					</div>
					<section
						key={post.id}
						className="mt-4 flex max-w-xl flex-col items-start justify-between sm:mt-8"
					>
						<div className="prose prose-sm mt-5 text-gray-600">
							<p>{post.body}</p>
						</div>
						<div className="mt-10 flex w-full items-center gap-x-4 border-gray-200 border-t pt-10 sm:mt-16 sm:pt-16">
							<img
								alt=""
								src={post.author.imageUrl}
								className="size-10 rounded-full bg-gray-50"
							/>
							<div className="text-sm/6">
								<p className="font-semibold text-gray-900">
									{post.author.name}
								</p>
								<p className="text-gray-600">{post.author.role}</p>
							</div>
						</div>
					</section>
				</div>
			</article>
		</div>
	)
}
