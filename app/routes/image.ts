import { fetchFlashboardImageUrl } from '~/services/flashboard.server'
import type { Route } from './+types/image'

export async function loader({ params }: Route.LoaderArgs) {
	// Get the image URL and fetch it from the Bucket
	const imageUrl = await fetchFlashboardImageUrl(params)
	const response = await fetch(imageUrl)

	// Override the headers to cache for a year because each image upload will have a unique key
	const headers = new Headers(response.headers)
	headers.set('Cache-Control', 'public, max-age=31536000')

	// Return the image response with the new headers
	return new Response(response.body, { headers })
}
