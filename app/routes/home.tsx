import { collect } from 'composable-functions'
import { Link, href } from 'react-router'
import { fetchPosts } from '~/business/blog.server'
import { fetchTrendingProducts } from '~/business/ecommerce.server'
import { fetchSiteContent } from '~/business/site-content.server'
import { formatMoney } from '~/helpers'
import { PostThumb } from '~/ui/post-thumb'
import type { Route } from './+types/home'

export async function loader() {
	const result = await collect({
		content: fetchSiteContent([
			'homeHeroTitle',
			'homeHeroDescription',
			'homeHeroCTA',
			'homeHeroImage',
			'offer1name',
			'offer1description',
			'offer2name',
			'offer2description',
			'offer3name',
			'offer3description',
		]),
		trendingProducts: fetchTrendingProducts,
		posts: fetchPosts,
	})()
	if (!result.success) throw new Response('Server Error', { status: 500 })

	return result.data
}

function OfferItem({
	name,
	description,
}: { name: string; description: string }) {
	return (
		<li className="flex flex-col">
			<div className="relative flex flex-1 flex-col justify-center bg-white px-4 py-6 text-center focus:z-10">
				<p className="text-gray-500 text-sm">{name}</p>
				<p className="font-semibold text-gray-900">{description}</p>
			</div>
		</li>
	)
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { content, trendingProducts, posts } = loaderData

	return (
		<>
			<div className="flex flex-col border-gray-200 border-b lg:border-0">
				<nav aria-label="Offers" className="order-last lg:order-first">
					<div className="mx-auto max-w-7xl lg:px-8">
						<ul className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
							<OfferItem
								name={content.offer1name}
								description={content.offer1description}
							/>
							<OfferItem
								name={content.offer2name}
								description={content.offer2description}
							/>
							<OfferItem
								name={content.offer3name}
								description={content.offer3description}
							/>
						</ul>
					</div>
				</nav>

				<div className="relative">
					<div
						aria-hidden="true"
						className="absolute hidden h-full w-1/2 bg-gray-100 lg:block"
					/>
					<div className="relative bg-gray-100 lg:bg-transparent">
						<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
							<div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
								<div className="lg:pr-16">
									<h1 className="font-bold text-4xl text-gray-900 tracking-tight sm:text-5xl xl:text-6xl">
										{content.homeHeroTitle}
									</h1>
									<p className="mt-4 text-gray-600 text-xl">
										{content.homeHeroDescription}
									</p>
									<div className="mt-6">
										<Link
											to={href('/products')}
											className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
										>
											{content.homeHeroCTA}
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="h-48 w-full sm:h-64 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-1/2">
						<img
							alt=""
							src={content.homeHeroImage}
							className="size-full object-cover"
						/>
					</div>
				</div>
			</div>
			<section aria-labelledby="trending-heading" className="bg-white">
				<div className="px-6 py-16 lg:mx-auto lg:max-w-7xl lg:px-8">
					<div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
						<h2
							id="trending-heading"
							className="font-bold text-2xl text-gray-900 tracking-tight"
						>
							Trending products
						</h2>
						<Link
							to={href('/products')}
							className="hidden font-semibold text-indigo-600 text-sm hover:text-indigo-500 sm:block"
						>
							See everything
							<span aria-hidden="true"> &rarr;</span>
						</Link>
					</div>
					<div className="mx-auto max-w-7xl overflow-hidden py-16 sm:py-24">
						<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
							{trendingProducts.map((product) => (
								<Link
									key={product.id}
									to={href('/products/:productId', {
										productId: String(product.id),
									})}
									className="group text-sm"
								>
									<img
										alt={product.name}
										title={product.description ?? product.name}
										src={product.imagesSrc[0]}
										className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
									/>
									<h3 className="mt-4 font-medium text-gray-900">
										{product.name}
									</h3>
									<p className="mt-2 font-medium text-gray-900">
										{formatMoney(product.priceCents)}
									</p>
								</Link>
							))}
						</div>
					</div>

					<div className="mt-12 sm:hidden">
						<Link
							to={href('/products')}
							className="font-semibold text-indigo-600 text-sm hover:text-indigo-500"
						>
							See everything
							<span aria-hidden="true"> &rarr;</span>
						</Link>
					</div>
				</div>
			</section>
			<div className="bg-white pb-24 sm:pb-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<p className="text-gray-600 text-lg/8">
							From the{' '}
							<Link
								to={href('/blog')}
								className="text-indigo-600 hover:underline"
							>
								blog
							</Link>
						</p>
					</div>
					<div className="mx-auto mt-2 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-gray-200 border-t pt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						{posts.map((post) => (
							<PostThumb post={post} key={post.id} />
						))}
					</div>
				</div>
			</div>{' '}
		</>
	)
}
