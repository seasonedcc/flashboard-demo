import 'dotenv/config'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrateDbDown } from './db'
import { db } from './db.server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsFolder = path.join(__dirname, 'migrations')

migrateDbDown(db, migrationsFolder)
