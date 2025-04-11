import { createCookie, createCookieSessionStorage } from 'react-router'
import { env } from '~/env.server'

const sessionStorage = createCookieSessionStorage<{ currentCartId: string }>({
	cookie: createCookie('session', {
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		secure: true,
		secrets: [env().sessionSecret],
	}),
})

export { sessionStorage }
