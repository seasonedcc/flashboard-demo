import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
	PopoverGroup,
} from "@headlessui/react";
import { BoltIcon } from "@heroicons/react/24/solid";
import {
	Bars3Icon,
	ShoppingCartIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, href } from "react-router";
import type { Route } from "../+types/root";

function Header({
	cartProducts,
	navigation,
}: Route.ComponentProps["loaderData"]) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [open, setOpen] = useState(false);
	return (
		<>
			<Dialog
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
				className="relative z-40 lg:hidden"
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
				/>

				<div className="fixed inset-0 z-40 flex">
					<DialogPanel
						transition
						className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
					>
						<div className="flex px-4 pb-2 pt-5">
							<button
								type="button"
								onClick={() => setMobileMenuOpen(false)}
								className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
							>
								<span className="sr-only">Close menu</span>
								<XMarkIcon aria-hidden="true" className="size-6" />
							</button>
						</div>

						<div className="space-y-6 border-t border-gray-200 px-4 py-6">
							{navigation.map((page) => (
								<div key={page.name} className="flow-root">
									<Link
										to={page.href}
										className="-m-2 block p-2 font-medium text-gray-900"
									>
										{page.name}
									</Link>
								</div>
							))}
						</div>
					</DialogPanel>
				</div>
			</Dialog>

			<header className="relative z-10">
				<nav aria-label="Top">
					{/* Top navigation */}
					<div className="bg-gray-900">
						<div className="mx-auto text-center flex h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
							<p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
								Get free delivery on orders over $100
							</p>
						</div>
					</div>

					{/* Secondary navigation */}
					<div className="bg-white">
						<div className="border-b border-gray-200">
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
								<div className="flex h-16 items-center justify-between">
									{/* Logo (lg+) */}
									<div className="hidden lg:flex lg:items-center">
										<Link to={href("/")}>
											<span className="sr-only">Flashboard Demo Store</span>
											<BoltIcon
												className="size-8 text-yellow-400"
												title="Flashboard Demo"
											/>
										</Link>
									</div>

									<div className="hidden h-full lg:flex">
										{/* Mega menus */}
										<PopoverGroup className="ml-8">
											<div className="flex h-full justify-center space-x-8">
												{navigation.map((page) => (
													<Link
														key={page.name}
														to={page.href}
														className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
													>
														{page.name}
													</Link>
												))}
											</div>
										</PopoverGroup>
									</div>

									{/* Mobile menu and search (lg-) */}
									<div className="flex flex-1 items-center lg:hidden">
										<button
											type="button"
											onClick={() => setMobileMenuOpen(true)}
											className="-ml-2 rounded-md bg-white p-2 text-gray-400"
										>
											<span className="sr-only">Open menu</span>
											<Bars3Icon aria-hidden="true" className="size-6" />
										</button>
									</div>

									{/* Logo (lg-) */}
									<Link to={href("/")} className="lg:hidden">
										<span className="sr-only">Flashboard Demo Store</span>
										<img
											alt=""
											src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
											className="h-8 w-auto"
										/>
									</Link>

									<div className="flex flex-1 items-center justify-end">
										<div className="flex items-center lg:ml-8">
											<span
												aria-hidden="true"
												className="mx-4 h-6 w-px bg-gray-200 lg:mx-6"
											/>

											<div className="flow-root">
												<button
													type="button"
													onClick={() => setOpen(true)}
													className="group -m-2 flex items-center p-2 cursor-pointer"
												>
													<ShoppingCartIcon
														aria-hidden="true"
														className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
													/>
													<span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
														0
													</span>
													<span className="sr-only">
														items in cart, view bag
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
			<Dialog open={open} onClose={setOpen} className="relative z-10">
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
											<DialogTitle className="text-lg font-medium text-gray-900">
												Shopping cart
											</DialogTitle>
											<div className="ml-3 flex h-7 items-center">
												<button
													type="button"
													onClick={() => setOpen(false)}
													className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
												>
													<span className="absolute -inset-0.5" />
													<span className="sr-only">Close panel</span>
													<XMarkIcon aria-hidden="true" className="size-6" />
												</button>
											</div>
										</div>

										<div className="mt-8">
											<div className="flow-root">
												<ul className="-my-6 divide-y divide-gray-200">
													{cartProducts.map((product) => (
														<li key={product.id} className="flex py-6">
															<div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
																<img
																	alt={product.imageAlt}
																	src={product.imageSrc}
																	className="size-full object-cover"
																/>
															</div>

															<div className="ml-4 flex flex-1 flex-col">
																<div>
																	<div className="flex justify-between text-base font-medium text-gray-900">
																		<h3>
																			<Link
																				to={href("/products/:id", {
																					id: String(product.id),
																				})}
																			>
																				{product.name}
																			</Link>
																		</h3>
																		<p className="ml-4">{product.price}</p>
																	</div>
																	<p className="mt-1 text-sm text-gray-500">
																		{product.color}
																	</p>
																</div>
																<div className="flex flex-1 items-end justify-between text-sm">
																	<p className="text-gray-500">
																		Qty {product.quantity}
																	</p>

																	<div className="flex">
																		<button
																			type="button"
																			className="font-medium text-indigo-600 hover:text-indigo-500"
																		>
																			Remove
																		</button>
																	</div>
																</div>
															</div>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>

									<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
										<div className="flex justify-between text-base font-medium text-gray-900">
											<p>Subtotal</p>
											<p>$262.00</p>
										</div>
										<div className="mt-6">
											<button
												type="button"
												className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
											>
												Place order
											</button>
										</div>
									</div>
								</div>
							</DialogPanel>
						</div>
					</div>
				</div>
			</Dialog>
		</>
	);
}

export { Header };
