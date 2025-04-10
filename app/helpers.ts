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

export { makeTypedEnvironment }
