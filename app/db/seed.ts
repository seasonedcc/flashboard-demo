import 'dotenv/config'
import { hash } from 'bcryptjs'
import type { Kysely } from 'kysely'
import type { BlogPostState, DB } from './types'

async function seed(db: () => Kysely<DB>) {
	// make it drop tables if they exist before creating them
	await db().deleteFrom('lineItems').execute()
	await db().deleteFrom('carts').execute()
	await db().deleteFrom('orders').execute()
	await db().deleteFrom('blogPosts').execute()
	await db().deleteFrom('products').execute()
	await db().deleteFrom('users').execute()
	await db().deleteFrom('siteContent').execute()

	// Create users
	const users = await Promise.all(
		[
			{
				email: 'john.doe@example.com',
				passwordHash: await hash('password123', 10),
			},
			{
				email: 'jane.smith@example.com',
				passwordHash: await hash('password123', 10),
			},
			{
				email: 'admin@store.com',
				passwordHash: await hash('admin123', 10),
			},
		].map((user) =>
			db()
				.insertInto('users')
				.values(user)
				.returningAll()
				.executeTakeFirstOrThrow()
		)
	)

	// Create products
	const products = await Promise.all(
		[
			{
				name: 'Premium Wireless Headphones',
				description: 'High-quality wireless headphones with noise cancellation',
				longDescription:
					'Experience crystal clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals alike.',
				priceCents: 29900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Premium Wireless Headphones',
					description:
						'High-quality wireless headphones with noise cancellation',
				}),
				stock: 50,
				trending: true,
				images: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '33ca92ab-187b-457f-9127-ef344f4b5367',
						filename: 'headphones.jpeg',
						contentType: 'image/jpeg',
						size: 6675,
					},
				]),
			},
			{
				name: 'Smart Fitness Watch',
				description: 'Track your health and fitness goals with precision',
				longDescription:
					'Stay on top of your fitness goals with our advanced smart watch. Features include heart rate monitoring, sleep tracking, GPS, and water resistance up to 50m.',
				priceCents: 19900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Smart Fitness Watch',
					description: 'Advanced fitness tracking watch',
				}),
				stock: 75,
				trending: true,
				images: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '20d3b49c-8a7f-4f5b-99c0-c9bc2da887d0',
						filename: 'smart watch.jpg',
						contentType: 'image/jpeg',
						size: 65001,
					},
				]),
			},
			{
				name: 'Portable Power Bank',
				description: '20000mAh high-capacity portable charger',
				longDescription:
					'Never run out of battery with our high-capacity power bank. Features fast charging, multiple ports, and compact design perfect for travel.',
				priceCents: 4900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Portable Power Bank',
					description: '20000mAh high-capacity portable charger',
				}),
				stock: 100,
				images: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: 'f1c868c2-36ce-4336-81e8-a0cb4ce16092',
						filename: 'Screenshot 2025-04-10 at 15.58.01.png',
						contentType: 'image/png',
						size: 1245480,
					},
				]),
			},
		].map((product) =>
			db()
				.insertInto('products')
				.values(product)
				.returningAll()
				.executeTakeFirstOrThrow()
		)
	)

	// Create blog posts
	await Promise.all(
		[
			{
				title: 'Top Tech Trends for 2025',
				content:
					"<p>As we move further into 2025, we're seeing exciting developments in consumer electronics...</p>",
				slug: 'top-tech-trends-2025',
				state: 'published' as BlogPostState,
			},
			{
				title: 'How to Choose the Right Headphones',
				content:
					'<p>With so many options available, choosing the perfect headphones can be overwhelming...</p>',
				slug: 'choose-right-headphones',
				state: 'published' as BlogPostState,
			},
			{
				title: 'Upcoming Product Launch',
				content:
					"<p>We're excited to announce our newest product line coming this summer...</p>",
				slug: 'upcoming-product-launch',
				state: 'draft' as BlogPostState,
			},
		].map((post) => db().insertInto('blogPosts').values(post).execute())
	)

	// Create carts with line items
	await Promise.all(
		users.map(async (user) => {
			const cart = await db()
				.insertInto('carts')
				.values({ userId: user.id })
				.returningAll()
				.executeTakeFirstOrThrow()

			// Add some items to each cart
			await db()
				.insertInto('lineItems')
				.values([
					{
						cartId: cart.id,
						productId: products[0].id,
						quantity: 1,
					},
					{
						cartId: cart.id,
						productId: products[1].id,
						quantity: 2,
					},
				])
				.execute()
		})
	)

	// Create sample orders
	await Promise.all(
		users.map(async (user) => {
			return await db()
				.insertInto('orders')
				.values({
					userId: user.id,
					totalCents: 49900,
					stripeResponse: JSON.stringify({
						id: 'ch_mock_12345',
						status: 'succeeded',
						amount: 49900,
					}),
				})
				.execute()
		})
	)

	// Create site content
	await db()
		.insertInto('siteContent')
		.values([
			{ key: 'offer1name', value: 'Latest Gadget' },
			{ key: 'offer1description', value: 'Explore our newest tech.' },
			{ key: 'offer2name', value: 'Summer Sale' },
			{
				key: 'offer2description',
				value: 'Discounts on select items.',
			},
			{ key: 'offer3name', value: 'Free Shipping' },
			{
				key: 'offer3description',
				value: 'On orders over $50.',
			},
			{ key: 'homeHero', value: 'Welcome to our store!' },
			{
				key: 'homeHeroDescription',
				value: 'Find the best products for the best price.',
			},
		])
		.execute()
}

export { seed }
