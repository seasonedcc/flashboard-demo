import { camelKeys } from 'string-ts'
import type { CamelKeys } from 'string-ts'

/**
 * Creates a typed environment function that parses, camelCases, and caches the arguments.
 * @param schema - The schema used to parse the arguments.
 * @returns A function that takes arguments and returns a typed environment.
 */
function makeTypedEnvironment<T>(schema: { parse: (u: unknown) => T }) {
	let env: CamelKeys<T>
	// args will usually be process.env but can be any object
	return (args: Record<string, unknown>) => {
		// if the env is already set, return it
		if (env) return env
		// if the env is not set, parse the args and camelCase them
		env = camelKeys(schema.parse(args))
		return env
	}
}

/**
 * Formats a date into a human-readable string.
 * @param date - The date to format.
 * @returns A string representing the formatted date.
 */
function formatDate(date: Date) {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

/**
 * Formats a number of cents into a currency string.
 * @param cents - The amount in cents to format.
 * @returns A string representing the formatted currency value.
 */
function formatMoney(cents: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(cents / 100)
}

/**
 * Checks if a value is a valid JSON string.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a valid JSON string.
 */
function isJsonString(value: unknown): value is string {
	if (typeof value !== 'string') return false
	try {
		JSON.parse(value)
		return true
	} catch {
		return false
	}
}

export { formatDate, formatMoney, makeTypedEnvironment, isJsonString }
