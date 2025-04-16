import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { UnpackData } from 'composable-functions'
import { useCallback, useEffect, useRef } from 'react'
import { Form, Link, href, useNavigation, useSearchParams } from 'react-router'
import type { getCurrentCart } from '~/business/carts.server'
import { formatMoney } from '~/helpers'

type Props = { cart?: UnpackData<typeof getCurrentCart> }
function Cart({ cart }: Props) {
	const navigation = useNavigation()
	const [params, setParams] = useSearchParams()

	// The cart state is controlled by the URL params
	const closeCart = useCallback(
		() => setParams({}, { preventScrollReset: true }),
		[setParams]
	)
	const openCart = useCallback(
		() => setParams({ cart: 'open' }, { preventScrollReset: true }),
		[setParams]
	)

	const isCartEmpty = !cart || cart.count < 1
	const previousEmpty = useRef(isCartEmpty)

	// A POST to / is a fake order being placed
	const isPlacingOrder =
		navigation.formMethod === 'POST' && navigation.formAction === '/'

	// A POST to /products is a product being added
	const isAddingItem =
		navigation.formMethod === 'POST' &&
		navigation.formAction?.includes('/products/')

	useEffect(() => {
		// Open the cart when the user adds an item to it
		if (isAddingItem) {
			setTimeout(openCart, 500)
		}
	}, [isAddingItem, openCart])

	// Closes the cart when all the items are removed
	useEffect(() => {
		// If the cart is empty and the previous count was not, close the cart
		if (isCartEmpty && previousEmpty.current === false) {
			setTimeout(closeCart, 500)
		}
		// Update the previous value
		previousEmpty.current = isCartEmpty
	}, [isCartEmpty, closeCart])

	if (!cart) return null

	return (
		<Dialog
			open={params.get('cart') === 'open'}
			onClose={closeCart}
			className="relative z-10"
		>
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
			/>
			<div className="fixed inset-0 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden">
					<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
						<DialogPanel
							transition
							className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
						>
							<div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
								<div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
									<div className="flex items-start justify-between">
										<DialogTitle className="font-medium text-gray-900 text-lg">
											Shopping cart
										</DialogTitle>
										<div className="ml-3 flex h-7 items-center">
											<button
												type="button"
												onClick={closeCart}
												className="-m-2 relative p-2 text-gray-400 hover:text-gray-500"
											>
												<span className="-inset-0.5 absolute" />
												<span className="sr-only">Close panel</span>
												<XMarkIcon aria-hidden="true" className="size-6" />
											</button>
										</div>
									</div>
									<div className="mt-8">
										<div className="flow-root">
											<ul className="-my-6 divide-y divide-gray-200">
												{cart.lineItems.map((item) => (
													<LineItem key={item.id} {...item} />
												))}
											</ul>
										</div>
									</div>
								</div>
								<div className="border-gray-200 border-t px-4 py-6 sm:px-6">
									<div className="flex justify-between font-medium text-base text-gray-900">
										<p>Subtotal</p>
										<p>{formatMoney(cart.subtotal)}</p>
									</div>
									<p className="mt-6 text-gray-500">
										This is a technical demo, not a real purchase.
									</p>
									<Form method="post" action="/" className="mt-6">
										<button
											type="submit"
											disabled={isCartEmpty || isPlacingOrder}
											className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 font-medium text-base text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
										>
											{isCartEmpty
												? 'Add items to cart'
												: isPlacingOrder
													? 'Processing...'
													: 'Place fake order'}
										</button>
									</Form>
								</div>
							</div>
						</DialogPanel>
					</div>
				</div>
			</div>
		</Dialog>
	)
}

function LineItem({
	product,
	quantity,
	id,
}: NonNullable<Props['cart']>['lineItems'][number]) {
	if (!quantity) return null

	return (
		<li className="flex py-6">
			<div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
				<img
					alt={product.name}
					src={product.image}
					className="size-full object-cover"
				/>
			</div>
			<div className="ml-4 flex flex-1 flex-col">
				<div>
					<div className="flex justify-between font-medium text-base text-gray-900">
						<h3>
							<Link
								to={href('/products/:productId', {
									productId: String(product.id),
								})}
							>
								{product.name}
							</Link>
						</h3>
						<p className="ml-4">{formatMoney(product.priceCents)}</p>
					</div>
				</div>
				<Form
					method="post"
					action={href('/cart/remove/:lineItemId', { lineItemId: String(id) })}
					navigate={false}
					className="flex flex-1 items-end justify-between text-sm"
				>
					<p className="text-gray-500">Qty {quantity}</p>
					<div className="flex">
						<button
							type="submit"
							className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
						>
							Remove
						</button>
					</div>
				</Form>
			</div>
		</li>
	)
}

export { Cart }
