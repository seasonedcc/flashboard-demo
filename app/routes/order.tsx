import { collect } from 'composable-functions'
import { Link, href } from 'react-router'
import { fetchOrder } from '~/business/orders.server'
import type { Route } from './+types/order'

export async function loader({ params }: Route.LoaderArgs) {
	const result = await collect({ order: fetchOrder })(params)
	if (!result.success) throw new Response('Not Found', { status: 404 })

	return result.data
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { order } = loaderData
	return (
		<div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center">
				<h1 className="mt-4 text-balance font-semibold text-5xl text-gray-900 tracking-tight sm:text-7xl">
					Fake order placed!
				</h1>
				<p className="mt-6 text-pretty font-medium text-gray-500 text-lg sm:text-xl/8">
					We created a fake user with with this email: {order.email}
					<br />
					So you can go back to Flashboard and search for it.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<a
						href="https://www.getflashboard.com"
						target="_blank"
						className="rounded-md bg-indigo-600 px-3.5 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
						rel="noreferrer"
					>
						Go to Flashboard
					</a>
					<Link to={href('/')} className="font-semibold text-gray-900 text-sm">
						Or go back to the store <span aria-hidden="true">&rarr;</span>
					</Link>
				</div>
			</div>
		</div>
	)
}
