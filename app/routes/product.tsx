import { CheckIcon } from "@heroicons/react/20/solid";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import type { Route } from "./+types/product";
import { href, Link } from "react-router";

export async function loader() {
	const product = {
		name: "Everyday Ruck Snack",
		href: "#",
		price: "$220",
		description:
			"Don't compromise on snack-carrying capacity with this lightweight and spacious bag. The drawstring top keeps all your favorite chips, crisps, fries, biscuits, crackers, and cookies secure.",
		imageSrc:
			"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-featured-product-shot.jpg",
		imageAlt:
			"Model wearing light green backpack with black canvas straps and front zipper pouch.",
		sizes: [
			{
				name: "18L",
				description: "Perfect for a reasonable amount of snacks.",
			},
			{
				name: "20L",
				description: "Enough room for a serious amount of snacks.",
			},
		],
	};
	return { product };
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { product } = loaderData;

	const features = [
		{
			name: "Sleek design",
			description:
				"The machined kettle has a smooth black finish and contemporary shape that stands apart from most plastic appliances.",
		},
		{
			name: "Comfort handle",
			description: "Shaped for steady pours and insulated to prevent burns.",
		},
		{
			name: "One-button control",
			description:
				"The one button control has a digital readout for setting temperature and turning the kettle on and off.",
		},
		{
			name: "Long spout",
			description:
				"Designed specifically for controlled pour-overs that don't slash or sputter.",
		},
	];
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
										to={href("/")}
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
										to={href("/products")}
										className="font-medium text-gray-500 hover:text-gray-900"
									>
										Products
									</Link>
								</div>
							</li>
						</ol>
					</nav>

					<div className="mt-4">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							{product.name}
						</h1>
					</div>

					<section aria-labelledby="information-heading" className="mt-4">
						<h2 id="information-heading" className="sr-only">
							Product information
						</h2>

						<p className="text-lg text-gray-900 sm:text-xl">{product.price}</p>

						<div className="mt-4 space-y-6">
							<p className="text-base text-gray-500">{product.description}</p>
						</div>

						<div className="mt-6 flex items-center">
							<CheckIcon
								aria-hidden="true"
								className="size-5 shrink-0 text-green-500"
							/>
							<p className="ml-2 text-sm text-gray-500">
								In stock and ready to ship
							</p>
						</div>
					</section>
				</div>

				{/* Product image */}
				<div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
					<img
						alt={product.imageAlt}
						src={product.imageSrc}
						className="aspect-square w-full rounded-lg object-cover"
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
									className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
								>
									Add to bag
								</button>
							</div>
							<div className="mt-6 text-center">
								<p className="group inline-flex text-base font-medium">
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
						<div className="border-b border-gray-200 pb-10">
							<h2 className="font-medium text-gray-500">Machined Kettle</h2>
							<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
								Elegant simplicity
							</p>
						</div>

						<dl className="mt-10 space-y-10">
							{features.map((feature) => (
								<div key={feature.name}>
									<dt className="text-sm font-medium text-gray-900">
										{feature.name}
									</dt>
									<dd className="mt-3 text-sm text-gray-500">
										{feature.description}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div>
						<img
							alt="Black kettle with long pour spot and angled body on marble counter next to coffee mug and pour-over system."
							src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-feature-09-main-detail.jpg"
							className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
						/>
						<div className="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-6 lg:mt-8 lg:gap-8">
							<img
								alt="Detail of temperature setting button on kettle bass with digital degree readout."
								src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-feature-09-detail-01.jpg"
								className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
							/>
							<img
								alt="Kettle spout pouring boiling water into coffee grounds in pour-over mug."
								src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-feature-09-detail-02.jpg"
								className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
