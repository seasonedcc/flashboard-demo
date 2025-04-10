import { makeDb } from './db'
import type { DB } from './types'

const db = makeDb<DB>()

export { db }
