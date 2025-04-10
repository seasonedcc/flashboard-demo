import { promises } from 'node:fs'
import * as path from 'node:path'
import {
	Migrator,
	type FileMigrationProviderProps,
	type Kysely,
	type Migration,
	type MigrationProvider,
	type MigrationResultSet,
} from 'kysely'

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

function isObject(obj: unknown): obj is Record<string, unknown> {
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

export { createMigrator, logMigrationResults }
