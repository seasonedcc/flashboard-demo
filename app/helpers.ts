import { camelKeys } from 'string-ts'
import type { CamelKeys } from 'string-ts'

function makeTypedEnvironment<T>(schema: { parse: (u: unknown) => T }) {
	let env: CamelKeys<T>
	return (args: Record<string, unknown>) => {
		if (env) return env
		env = camelKeys(schema.parse(args))
		return env
	}
}

function formatDate(date: Date) {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

function formatMoney(cents: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(cents / 100)
}

export { formatDate, formatMoney, makeTypedEnvironment }
