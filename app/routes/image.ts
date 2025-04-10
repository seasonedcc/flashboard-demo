import type { Route } from './+types/image'
import { fetchFlashboardImageUrl } from '~/s3-client.server'

export async function loader({ params }: Route.LoaderArgs) {
	const imageUrl = await fetchFlashboardImageUrl(params)
	const response = await fetch(imageUrl)
	const headers = new Headers(response.headers)
	// Cache for a year because each image upload will have a unique key
	headers.set('Cache-Control', 'public, max-age=31536000')
	return new Response(response.body, { headers })
}
