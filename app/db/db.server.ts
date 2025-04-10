import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import { env } from '~/env.server'
import type { DB } from './types'

declare global {
	namespace Database {
		var db: Kysely<DB>
	}
}

const plugins = [new CamelCasePlugin()]

function envError() {
	return new Error(
		'You should either have a DATABASE_URL env var or DATABASE_HOST + DATABASE_NAME + DATABASE_USER + DATABASE_PASSWORD'
	)
}

function getConnectionOptions() {
	if (env().databaseUrl) {
		return { connectionString: env().databaseUrl }
	}

	const {
		databaseHost,
		databasePort,
		databaseName,
		databaseUser,
		databasePassword,
	} = env()

	if (!databaseHost) throw envError()
	if (!databaseName) throw envError()
	if (!databaseUser) throw envError()
	if (!databasePassword) throw envError()

	return {
		host: databaseHost,
		port: databasePort,
		database: databaseName,
		user: databaseUser,
		password: databasePassword,
	}
}

function db() {
	if (global.Database?.db) return global.Database.db

	const pool = new pg.Pool({
		...getConnectionOptions(),
		application_name: 'Flashboard Demo Store',
	})
	pool.on('connect', (client) => {
		process.env.TZ = 'UTC'
		client.query(`SET timezone TO 'UTC'`)
	})

	const db = new Kysely<DB>({
		dialect: new PostgresDialect({ pool }),
		plugins,
	})
	global.Database = global.Database || {}
	global.Database.db = db
	return db
}

export { db }
