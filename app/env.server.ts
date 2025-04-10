import { z } from 'zod'
import { makeTypedEnvironment } from './helpers'

const getEnvironment = makeTypedEnvironment(
	z.object({
		// No need to set, it will be automatically set
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
		// Locally, you can use ?sslmode=disable in the URL to disable SSL (e.g. postgresql://youruser@localhost:5432/database?sslmode=disable)
		DATABASE_URL: z.string().optional(),
		DATABASE_HOST: z.string().optional(),
		DATABASE_PORT: z.preprocess(
			(val) => (val ? Number(val) : 5432),
			z.number()
		),
		DATABASE_NAME: z.string().optional(),
		DATABASE_USER: z.string().optional(),
		DATABASE_PASSWORD: z.string().optional(),
		SESSION_SECRET: z.string().min(1),
	})
)

const env = () => getEnvironment(process.env)

export { env }
