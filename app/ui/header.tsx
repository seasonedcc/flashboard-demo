import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { BoltIcon } from '@heroicons/react/24/solid'
import { useCallback } from 'react'
import { Link, href, useSearchParams } from 'react-router'

type Props = { cartCount?: number }
function Header({ cartCount }: Props) {
	// The cart state is controlled by the URL params
	const [, setParams] = useSearchParams()
	const openCart = useCallback(() => setParams({ cart: 'open' }), [setParams])

	return (
		<header className="relative z-10">
			<nav aria-label="Top">
				<div className="bg-gray-900">
					<div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-center sm:px-6 lg:px-8">
						<p className="flex-1 text-center font-medium text-sm text-white lg:flex-none">
							This is a demo store for Flashboard.{' '}
							<a
								href="https://www.getflashboard.com"
								target="_blank"
								rel="noreferrer"
								className="underline"
							>
								Create a demo panel
							</a>{' '}
							to edit this site in real time.
						</p>
					</div>
				</div>
				<div className="bg-white">
					<div className="border-gray-200 border-b">
						<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
							<div className="flex h-16 items-center justify-between">
								<div className="flex items-center">
									<Link to={href('/')}>
										<span className="sr-only">Flashboard Demo Store</span>
										<BoltIcon
											className="size-8 text-yellow-400"
											title="Flashboard Demo"
										/>
									</Link>
								</div>
								<div className="ml-4 flex h-full justify-center space-x-8 lg:ml-8">
									<Link
										to={href('/products')}
										className="flex items-center font-medium text-gray-700 text-sm hover:text-gray-800"
									>
										Products
									</Link>
									<Link
										to={href('/blog')}
										className="flex items-center font-medium text-gray-700 text-sm hover:text-gray-800"
									>
										Blog
									</Link>
								</div>
								<div className="flex flex-1 items-center justify-end">
									<div className="ml-8 flex items-center">
										<span
											aria-hidden="true"
											className="mx-4 h-6 w-px bg-gray-200 lg:mx-6"
										/>
										{typeof cartCount === 'number' && (
											<div className="flow-root">
												<button
													type="button"
													onClick={openCart}
													className="group -m-2 flex cursor-pointer items-center p-2"
												>
													<ShoppingCartIcon
														aria-hidden="true"
														className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
													/>
													<span className="ml-2 font-medium text-gray-700 text-sm group-hover:text-gray-800">
														{cartCount}
													</span>
													<span className="sr-only">
														items in cart, view bag
													</span>
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	)
}

export { Header }
