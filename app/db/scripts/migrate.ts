import 'dotenv/config'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Kysely } from 'kysely'
import { db } from '../db.server'
import { createMigrator, logMigrationResults } from './migrator'

async function migrateDbToLatest(
	db: () => Kysely<any>,
	migrationFolder: string
) {
	const migrator = createMigrator(db, migrationFolder)
	await logMigrationResults(migrator.migrateToLatest())
	await db().destroy()
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsFolder = path.join(__dirname, '..', 'migrations')

migrateDbToLatest(db, migrationsFolder)
