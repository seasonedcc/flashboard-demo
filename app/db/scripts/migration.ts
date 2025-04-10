import 'dotenv/config'
import fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { kebabCase } from 'string-ts'

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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsPath = path.join(__dirname, '..', 'migrations')

const [_command, _file, ...names] = process.argv
const migrationName = kebabCase(names.join(' '))

createDbMigration(migrationsPath, migrationName)
