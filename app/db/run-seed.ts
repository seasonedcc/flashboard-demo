import { db } from '~/db/db.server'
import { seed } from './seed'

async function main() {
	try {
		console.log('Seeding database...')
		await seed(db)
		console.log('Database seeded successfully!')
	} catch (error) {
		console.error('Error seeding database:', error)
		process.exit(1)
	}
}

main()
