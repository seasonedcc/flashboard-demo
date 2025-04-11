import { camelKeys } from 'string-ts'
import type { CamelKeys } from 'string-ts'

function cx(...args: unknown[]): string {
	return args
		.flat()
		.filter((x) => typeof x === 'string')
		.join(' ')
}

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

function isJsonString(value: unknown): value is string {
	if (typeof value !== 'string') return false
	try {
		JSON.parse(value)
		return true
	} catch {
		return false
	}
}

export { cx, formatDate, formatMoney, makeTypedEnvironment, isJsonString }
