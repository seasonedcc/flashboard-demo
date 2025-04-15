import { z } from 'zod'
import { makeTypedEnvironment } from './helpers'

// This function will parse the environment variables and return a strongly
// typed object with camelCased keys
const getEnvironment = makeTypedEnvironment(
	z.object({
		// No need to set, it will be automatically set
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
		// Locally, you can use ?sslmode=disable in the URL to disable SSL
		// (e.g. postgresql://youruser@localhost:5432/database?sslmode=disable)
		DATABASE_POOL_MAX: z.preprocess(
			(val) => (val ? Number(val) : 6),
			z.number()
		),
		DATABASE_REJECT_UNAUTHORIZED: z.preprocess(
			(val) => (val ? Boolean(val) : false),
			z.boolean()
		),
		DATABASE_URL: z.string().optional(),
		DATABASE_HOST: z.string().optional(),
		DATABASE_PORT: z.preprocess(
			(val) => (val ? Number(val) : 5432),
			z.number()
		),
		DATABASE_NAME: z.string().optional(),
		DATABASE_USER: z.string().optional(),
		DATABASE_PASSWORD: z.string().optional(),
		DATABASE_CERT: z.string().optional(),
		SESSION_SECRET: z.string().min(1),
		S3_ENDPOINT: z.string().min(1),
		S3_REGION: z.string().min(1),
		S3_ACCESS_KEY_ID: z.string().min(1),
		S3_SECRET_ACCESS_KEY: z.string().min(1),
		S3_BUCKET_NAME: z.string().default('flashboard-demo-secure'),
	})
)

const env = () => getEnvironment(process.env)

export { env }
