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
	const longDescription = `<h3>Machined Kettle</h3><h1>Elegant simplicity</h1><hr><h4>Sleek design</h4><p>The machined kettle has a smooth black finish and contemporary shape that stands apart from most plastic appliances.</p><h4>Comfort handle</h4><p>Shaped for steady pours and insulated to prevent burns.</p><h4>One-button control</h4><p>The one button control has a digital readout for setting temperature and turning the kettle on and off.</p><h4>Long spout</h4><p>Designed specifically for controlled pour-overs that don't slash or sputter.</p>`
	const products = await Promise.all(
		[
			{
				name: 'Premium Wireless Headphones',
				description: 'High-quality wireless headphones with noise cancellation',
				longDescription,
				priceCents: 29900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Premium Wireless Headphones',
					description:
						'High-quality wireless headphones with noise cancellation',
				}),
				stock: 50,
				trending: true,
				images: JSON.stringify(
					new Array(4).fill({
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '33ca92ab-187b-457f-9127-ef344f4b5367',
						filename: 'headphones.jpeg',
						contentType: 'image/jpeg',
						size: 6675,
					})
				),
			},
			{
				name: 'Smart Fitness Watch',
				description: 'Track your health and fitness goals with precision',
				longDescription,
				priceCents: 19900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Smart Fitness Watch',
					description: 'Advanced fitness tracking watch',
				}),
				stock: 75,
				trending: true,
				images: JSON.stringify(
					new Array(4).fill({
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '20d3b49c-8a7f-4f5b-99c0-c9bc2da887d0',
						filename: 'smart watch.jpg',
						contentType: 'image/jpeg',
						size: 65001,
					})
				),
			},
			{
				name: 'Portable Power Bank',
				description: '20000mAh high-capacity portable charger',
				longDescription,
				priceCents: 4900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Portable Power Bank',
					description: '20000mAh high-capacity portable charger',
				}),
				stock: 100,
				images: JSON.stringify(
					new Array(4).fill({
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: 'f1c868c2-36ce-4336-81e8-a0cb4ce16092',
						filename: 'Screenshot 2025-04-10 at 15.58.01.png',
						contentType: 'image/png',
						size: 1245480,
					})
				),
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
				coverImage: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: 'e2fce81a-0098-4f0e-ac63-75103208ceec',
						filename: 'photo-1547586696-ea22b4d4235d.avif',
						contentType: 'image/avif',
						size: 859977,
					},
				]),
			},
			{
				title: 'How to Choose the Right Headphones',
				content:
					'<p>With so many options available, choosing the perfect headphones can be overwhelming...</p>',
				slug: 'choose-right-headphones',
				state: 'published' as BlogPostState,
				coverImage: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '0e5ca6df-26db-458d-b8bd-bc04dccf0846',
						filename: 'photo-1496128858413-b36217c2ce36.avif',
						contentType: 'image/avif',
						size: 360853,
					},
				]),
			},
			{
				title: 'Upcoming Product Launch',
				content:
					"<p>We're excited to announce our newest product line coming this summer...</p>",
				slug: 'upcoming-product-launch',
				state: 'draft' as BlogPostState,
				coverImage: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: 'e2fce81a-0098-4f0e-ac63-75103208ceec',
						filename: 'photo-1547586696-ea22b4d4235d.avif',
						contentType: 'image/avif',
						size: 859977,
					},
				]),
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
			{ key: 'homeHeroTitle', value: 'Welcome to our store!' },
			{
				key: 'homeHeroDescription',
				value: 'Find the best products for the best price.',
			},
			{ key: 'homeHeroCTA', value: 'Shop Now' },
			{
				key: 'homeHeroImage',
				value: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '660f85d8-01a5-4b4c-8692-d06f66299938',
						filename: 'home-page-02-hero-half-width.jpg',
						contentType: 'image/jpeg',
						size: 209352,
					},
				]),
			},
			{ key: 'siteBanner', value: 'Get free delivery on orders over $100' },
			{ key: 'productsTitle', value: 'All Products' },
			{
				key: 'productsSubtitle',
				value:
					'Thoughtfully designed objects for the workspace, home, and travel.',
			},
			{ key: 'blogTitle', value: 'From the blog' },
			{
				key: 'blogSubtitle',
				value: 'Learn how to grow your business with our expert advice.',
			},
		])
		.execute()
}

export { seed }
