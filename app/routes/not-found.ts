import type { Route } from './+types/not-found'

export async function loader({ request }: Route.LoaderArgs) {
	const { pathname } = new URL(request.url)

	throw new Response(`No route matches path: ${pathname}`, {
		status: 404,
		statusText: 'Not Found',
	})
}

export { ErrorBoundary } from '~/root'
