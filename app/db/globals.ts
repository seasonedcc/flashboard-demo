declare global {
	namespace TypedGlobals {
		var globals: Record<string, unknown>
	}
}

function getOrSetGlobal<G>(key: string, value: G | (() => G)): G {
	if (!global.TypedGlobals) global.TypedGlobals = { globals: {} }
	if (global.TypedGlobals.globals[key])
		return global.TypedGlobals.globals[key] as G
	const initialValue =
		typeof value === 'function' ? (value as () => G)() : value
	global.TypedGlobals.globals[key] = initialValue
	return initialValue
}

function mutateGlobal<G>(key: string, value: G | ((previousValue: G) => G)): G {
	if (!global.TypedGlobals) global.TypedGlobals = { globals: {} }

	const newValue =
		typeof value === 'function'
			? (value as (previousValue: G) => G)(
					global.TypedGlobals.globals[key] as G
				)
			: value
	global.TypedGlobals.globals[key] = newValue
	return newValue
}

export { getOrSetGlobal, mutateGlobal }
