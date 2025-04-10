import type {
	FileMigrationProviderProps,
	Migration,
	MigrationProvider,
	MigrationResultSet,
	SelectQueryBuilder,
} from 'kysely'

import fs, { promises } from 'node:fs'
import * as path from 'node:path'
import { CamelCasePlugin, Kysely, Migrator, PostgresDialect } from 'kysely'
import pg from 'pg'
import { env } from '~/env.server'
import { getOrSetGlobal } from './globals'

type DrainOuterGeneric<T> = [T] extends [unknown] ? T : never
type ShallowRecord<K extends keyof any, T> = DrainOuterGeneric<{
	[P in K]: T
}>

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

function makeDbPool(
	applicationName = 'Remaster App',
	{
		timezone,
		...options
	}: Omit<pg.PoolConfig, 'application_name'> & { timezone?: string } = {}
) {
	const certOptions = {}

	const pool = new pg.Pool({
		...getConnectionOptions(),
		application_name: applicationName,
		ssl: {
			...certOptions,
		},
		...options,
	})

	if (timezone) {
		pool.on('connect', (client) => {
			process.env.TZ = timezone
			client.query(`SET timezone TO '${timezone}'`)
		})
	}

	return pool
}

function makeDb<DB>() {
	return () =>
		getOrSetGlobal(
			'db',
			() =>
				new Kysely<DB>({
					dialect: new PostgresDialect({
						pool: makeDbPool('Remaster App', { timezone: 'UTC' }),
					}),
					plugins,
				})
		)
}

const MIGRATION_TEMPLATE = `import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
`

async function createDbMigration(
	migrationsFolder: string,
	migrationName: string
) {
	if (!migrationName) {
		console.error(
			'You must name this migration by running "pnpm run db:migration the name for your migration"'
		)
		process.exit(1)
	}

	const dateStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
	const fileName = `${migrationsFolder}/${dateStr}-${migrationName}.ts`
	const mkdir = () => fs.mkdirSync(migrationsFolder)

	try {
		if (!fs.lstatSync(migrationsFolder).isDirectory()) {
			mkdir()
		}
	} catch {
		fs.mkdirSync(migrationsFolder)
	}

	fs.writeFileSync(fileName, MIGRATION_TEMPLATE, 'utf8')
	console.log('Created Migration:', fileName)
}

class FileMigrationProvider implements MigrationProvider {
	readonly #props: FileMigrationProviderProps

	constructor(props: FileMigrationProviderProps) {
		this.#props = props
	}

	async getMigrations(): Promise<Record<string, Migration>> {
		const migrations: Record<string, Migration> = {}
		const files = await this.#props.fs.readdir(this.#props.migrationFolder)

		for (const fileName of files) {
			if (
				fileName.endsWith('.js') ||
				(fileName.endsWith('.ts') && !fileName.endsWith('.d.ts')) ||
				fileName.endsWith('.mjs') ||
				(fileName.endsWith('.mts') && !fileName.endsWith('.d.mts'))
			) {
				const migration = await import(
					/* @vite-ignore */
					this.#props.path.join(this.#props.migrationFolder, fileName)
				)
				const migrationKey = fileName.substring(0, fileName.lastIndexOf('.'))

				// Handle esModuleInterop export's `default` prop...
				if (isMigration(migration?.default)) {
					migrations[migrationKey] = migration.default
				} else if (isMigration(migration)) {
					migrations[migrationKey] = migration
				}
			}
		}

		return migrations
	}
}

function isFunction(obj: unknown): obj is (...args: any[]) => any {
	return typeof obj === 'function'
}

function isObject(obj: unknown): obj is ShallowRecord<string, unknown> {
	return typeof obj === 'object' && obj !== null
}

function isMigration(obj: unknown): obj is Migration {
	return isObject(obj) && isFunction(obj.up)
}

function createMigrator(db: () => Kysely<any>, migrationFolder: string) {
	return new Migrator({
		allowUnorderedMigrations: true,
		db: db(),
		provider: new FileMigrationProvider({
			fs: promises,
			path,
			migrationFolder,
		}),
	})
}

async function logMigrationResults(resultSet: Promise<MigrationResultSet>) {
	const { error, results } = await resultSet

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`Migration "${it.migrationName}" was executed successfully`)
		} else if (it.status === 'Error') {
			console.error(`Failed to execute migration "${it.migrationName}"`)
		}
	})

	if (error) {
		console.error('Failed to migrate')
		console.error(error)
		process.exit(1)
	}
}

async function migrateDbToLatest(
	db: () => Kysely<any>,
	migrationFolder: string
) {
	const migrator = createMigrator(db, migrationFolder)
	await logMigrationResults(migrator.migrateToLatest())
	await db().destroy()
}

async function migrateDbDown(db: () => Kysely<any>, migrationFolder: string) {
	const migrator = createMigrator(db, migrationFolder)
	await logMigrationResults(migrator.migrateDown())
	await db().destroy()
}

async function fetchTotal<DB, T extends keyof DB, O>(
	query: SelectQueryBuilder<DB, T, O>
) {
	const { count } = await query
		.select((eb) => eb.fn.countAll().as('count'))
		.$castTo<{ count: string }>()
		.executeTakeFirstOrThrow()

	return Number(count)
}

function fetchItems<DB, T extends keyof DB, O>(
	query: SelectQueryBuilder<DB, T, O>,
	{ page, perPage }: { page: number; perPage: number }
): Promise<O[]> {
	return query
		.limit(perPage)
		.offset((page - 1) * perPage)
		.execute()
}

async function fetchList<DB, T extends keyof DB, TotalOutput, ItemsOutput>(
	queryForTotal: SelectQueryBuilder<DB, T, TotalOutput>,
	queryForItems: SelectQueryBuilder<DB, T, ItemsOutput>,
	pagination: { page: number; perPage: number }
) {
	const [total, items] = await Promise.all([
		fetchTotal(queryForTotal),
		fetchItems(queryForItems, pagination),
	])

	return [items, { total, ...pagination }] as const
}

export {
	makeDb,
	makeDbPool,
	createDbMigration,
	migrateDbToLatest,
	migrateDbDown,
	fetchTotal,
	fetchItems,
	fetchList,
}
