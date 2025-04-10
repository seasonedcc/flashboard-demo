import 'dotenv/config'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { kebabCase } from 'string-ts'
import { createDbMigration } from './db'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsPath = path.join(__dirname, 'migrations')

const [_command, _file, ...names] = process.argv
const migrationName = kebabCase(names.join(' '))

createDbMigration(migrationsPath, migrationName)
