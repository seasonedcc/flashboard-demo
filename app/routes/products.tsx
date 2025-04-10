import { Link, href } from 'react-router'
import type { Route } from './+types/products'

export async function loader() {
	const products = [
		{
			id: 1,
			name: 'Leather Long Wallet',
			color: 'Natural',
			price: '$75',
			imageSrc:
				'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-04-trending-product-02.jpg',
			imageAlt: 'Hand stitched, orange leather long wallet.',
		},
	]
	return { products }
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
						<div key={product.id} className="group relative">
							<div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
								<img
									alt={product.imageAlt}
									src={product.imageSrc}
									className="size-full object-cover"
								/>
							</div>
							<h3 className="mt-4 text-gray-700 text-sm">
								<Link to={href('/products/:id', { id: String(product.id) })}>
									<span className="absolute inset-0" />
									{product.name}
								</Link>
							</h3>
							<p className="mt-1 text-gray-500 text-sm">{product.color}</p>
							<p className="mt-1 font-medium text-gray-900 text-sm">
								{product.price}
							</p>
						</div>
					))}
				</div>
			</div>
		</>
	)
}
