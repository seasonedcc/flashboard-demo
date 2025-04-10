import { Link, href } from 'react-router'
import { fetchTrendingProducts } from '~/business/ecommerce'
import type { Route } from './+types/products'

export async function loader() {
	return { products: await fetchTrendingProducts() }
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { products } = loaderData
	return (
		<>
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="py-24 text-center">
					<h1 className="font-bold text-4xl text-gray-900 tracking-tight">
						New Arrivals
					</h1>
					<p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
						Thoughtfully designed objects for the workspace, home, and travel.
					</p>
				</div>
				<div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
					{products.map((product) => (
						<Link
							key={product.id}
							to={href('/products/:id', { id: String(product.id) })}
							className="group text-sm"
						>
							<img
								alt={product.name}
								title={product.description ?? product.name}
								src={product.imageSrc || undefined}
								className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
							/>
							<h3 className="mt-4 font-medium text-gray-900">{product.name}</h3>
							<p className="mt-2 font-medium text-gray-900">
								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
								}).format(product.priceCents / 100)}
							</p>
						</Link>
					))}
				</div>
			</div>
		</>
	)
}
