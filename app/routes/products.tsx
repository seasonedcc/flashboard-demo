import { collect } from 'composable-functions'
import { Link, href } from 'react-router'
import { fetchProducts } from '~/business/ecommerce.server'
import { fetchSiteContent } from '~/business/site-content.server'
import { formatMoney } from '~/helpers'
import type { Route } from './+types/products'

export async function loader() {
	const result = await collect({
		products: fetchProducts,
		content: fetchSiteContent(['productsTitle', 'productsSubtitle']),
	})()
	if (!result.success) throw new Response('Server Error', { status: 500 })

	return result.data
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { products, content } = loaderData
	return (
		<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
			<div className="py-24 text-center">
				<h1 className="font-bold text-4xl text-gray-900 tracking-tight">
					{content.productsTitle}
				</h1>
				<p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
					{content.productsSubtitle}
				</p>
			</div>
			<div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
				{products.map((product) => (
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
						<h3 className="mt-4 font-medium text-gray-900">{product.name}</h3>
						<p className="mt-2 font-medium text-gray-900">
							{formatMoney(product.priceCents)}
						</p>
					</Link>
				))}
			</div>
		</div>
	)
}
