import { CheckIcon } from '@heroicons/react/20/solid'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { Link, href } from 'react-router'
import { fetchProduct } from '~/business/ecommerce'
import type { Route } from './+types/product'
import { formatMoney } from '~/helpers'

export async function loader({ params }: Route.LoaderArgs) {
	const product = await fetchProduct(params.id)

	if (!product) {
		throw new Response('Not Found', { status: 404 })
	}

	return { product }
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { product } = loaderData
	return (
		<div className="bg-white">
			<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
				{/* Product details */}
				<div className="lg:max-w-lg lg:self-end">
					<nav aria-label="Breadcrumb">
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
										to={href('/products')}
										className="font-medium text-gray-500 hover:text-gray-900"
									>
										Products
									</Link>
								</div>
							</li>
						</ol>
					</nav>

					<div className="mt-4">
						<h1 className="font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl">
							{product.name}
						</h1>
					</div>

					<section aria-labelledby="information-heading" className="mt-4">
						<h2 id="information-heading" className="sr-only">
							Product information
						</h2>
						<p className="text-gray-900 text-lg sm:text-xl">
							{formatMoney(product.priceCents)}
						</p>
						<div className="mt-4 space-y-6">
							<p className="text-base text-gray-500">{product.description}</p>
						</div>
						{product.stock > 0 && (
							<div className="mt-6 flex items-center">
								<CheckIcon
									aria-hidden="true"
									className="size-5 shrink-0 text-green-500"
								/>
								<p className="ml-2 text-gray-500 text-sm">
									In stock and ready to ship
								</p>
							</div>
						)}
					</section>
				</div>

				{/* Product image */}
				<div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
					<img
						alt={product.name}
						title={product.description ?? product.name}
						src={product.imagesSrc[0]}
						className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
					/>
				</div>

				<div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
					<section aria-labelledby="options-heading">
						<h2 id="options-heading" className="sr-only">
							Product options
						</h2>

						<form>
							<div className="mt-10">
								<button
									type="submit"
									disabled={!product.stock}
									className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 font-medium text-base text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
								>
									{product.stock ? 'Add to bag' : 'Out of stock'}
								</button>
							</div>
							<div className="mt-6 text-center">
								<p className="group inline-flex font-medium text-base">
									<ShieldCheckIcon
										aria-hidden="true"
										className="mr-2 size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
									/>
									<span className="text-gray-500 hover:text-gray-700">
										Lifetime Guarantee
									</span>
								</p>
							</div>
						</form>
					</section>
				</div>
			</div>
			<div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
				<div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
					<div>
						{product.longDescription && (
							<div
								className="border-gray-200 border-b pb-10 prose prose-xs"
								dangerouslySetInnerHTML={{ __html: product.longDescription }}
							/>
						)}
					</div>

					<div>
						{product.imagesSrc[1] && (
							<img
								alt={product.name}
								src={product.imagesSrc[1]}
								className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
							/>
						)}
						<div className="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-6 lg:mt-8 lg:gap-8">
							{product.imagesSrc[2] && (
								<img
									alt={product.name}
									src={product.imagesSrc[2]}
									className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
								/>
							)}
							{product.imagesSrc[3] && (
								<img
									alt={product.name}
									src={product.imagesSrc[3]}
									className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
