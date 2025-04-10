import * as readline from 'node:readline/promises'
import { db } from '~/db/db.server'
import { seed } from '../seed'
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

async function askForConfirmation() {
	const answer = await rl.question(
		'Are you sure you want to drop the database and re-seed? (y/n) '
	)
	rl.close()

	if (!['y', 'yes'].includes(answer.toLowerCase())) {
		console.log('Seed cancelled.')
		process.exit(0)
	}
}

async function main() {
	try {
		const hasData = await db()
			.selectFrom('users')
			.selectAll()
			.execute()
			.then((rows) => rows.length > 0)
		if (hasData) {
			if (process.argv.includes('--confirm')) {
				console.log('Skipping confirmation due to --confirm flag.')
			} else {
				await askForConfirmation()
			}
		}

		console.log('Seeding database...')
		await seed(db)
		console.log('Database seeded successfully!')
		process.exit(0)
	} catch (error) {
		console.error('Error seeding database:', error)
		process.exit(1)
	}
}

main()
