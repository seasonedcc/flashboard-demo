import type { Route } from './+types/cart-remove'
import { getCartId, removeLineItem } from '~/business/carts.server'

export async function action({ request, params }: Route.ActionArgs) {
	const result = await removeLineItem(params, await getCartId(request))
	if (!result.success) throw new Response('Server Error', { status: 500 })

	return result.data
}
