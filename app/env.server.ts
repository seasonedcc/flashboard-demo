import { z } from 'zod'
import { makeTypedEnvironment } from './helpers'

const getEnvironment = makeTypedEnvironment(
	z.object({
		// No need to set, it will be automatically set
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
		// Locally, you can use ?sslmode=disable in the URL to disable SSL (e.g. postgresql://youruser@localhost:5432/database?sslmode=disable)
		DATABASE_URL: z.string().min(1),
		SESSION_SECRET: z.string().min(1),
		S3_ENDPOINT: z.string().min(1),
		S3_REGION: z.string().min(1),
		S3_ACCESS_KEY_ID: z.string().min(1),
		S3_SECRET_ACCESS_KEY: z.string().min(1),
	})
)

const env = () => getEnvironment(process.env)

export { env }
