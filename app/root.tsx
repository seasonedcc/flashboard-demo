import { collect } from 'composable-functions'
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	data,
	href,
	isRouteErrorResponse,
	redirect,
} from 'react-router'
import type { Route } from './+types/root'
import './styles/app.css'
import { getCart, getCartId } from './business/carts.server'
import { placeOrder } from './business/orders.server'
import { sessionStorage } from './business/session.server'
import { Footer } from './ui/footer'
import { Header } from './ui/header'

export const meta: Route.MetaFunction = () => [
	{ title: 'Flashboard Demo Store' },
	{ name: 'description', content: 'Explore this demo' },
]

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
	{ rel: 'icon', href: '/favicon.png', type: 'image/png' },
]

export async function loader({ request }: Route.LoaderArgs) {
	const cartId = await getCartId(request)
	const result = await collect({ cart: getCart })({ cartId })

	if (!result.success) throw new Response('Server Error', { status: 500 })

	const cookieHeader = request.headers.get('Cookie')
	const session = await sessionStorage.getSession(cookieHeader)
	session.set('currentCartId', cartId)
	const headers = new Headers({
		'Set-Cookie': await sessionStorage.commitSession(session),
	})
	return data(result.data, { headers })
}

export async function action({ request }: Route.ActionArgs) {
	const result = await placeOrder(null, await getCartId(request))
	if (!result.success) throw new Response('Server Error', { status: 500 })

	return redirect(href('/order/:orderId', { orderId: result.data.id }))
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				/>
				<Meta />
				<Links />
			</head>
			<body className="flex min-h-screen flex-col overflow-x-hidden bg-white">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App({ loaderData }: Route.ComponentProps) {
	const { cart } = loaderData
	return (
		<>
			<Header cart={cart} />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</>
	)
}

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
	let message = 'Oops!'
	let details = 'An unexpected error occurred.'
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = String(error.status)
		details = error.statusText || error.data || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<>
			<Header cart={loaderData?.cart} />
			<main className="grid min-h-full flex-1 place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="font-semibold text-base text-indigo-600">{message}</p>
					<h1 className="mt-4 text-balance font-semibold text-5xl text-gray-900 tracking-tight sm:text-7xl">
						{details}
					</h1>
					{stack && (
						<p className="mt-6 text-pretty font-medium text-gray-500 text-lg sm:text-xl/8">
							{stack}
						</p>
					)}
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Link
							to={href('/')}
							className="rounded-md bg-indigo-600 px-3.5 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
						>
							Go back home
						</Link>
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}
