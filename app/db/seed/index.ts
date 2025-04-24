import 'dotenv/config'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hash } from 'bcryptjs'
import type { Kysely } from 'kysely'
import type { BlogPostState, DB } from '../types'
import { uploadSeedImages } from './upload-images'
import { randomUUID } from 'node:crypto'
import { faker } from '@faker-js/faker/locale/pl'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function seed(db: () => Kysely<DB>) {
	// Delete from tables before creating the items
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

	console.log(
		'Uploading product images to storage service. This may take a few minutes...'
	)
	const productImages = await uploadSeedImages(
		path.join(__dirname, 'images', 'products')
	)
	console.log('Uploaded images:', Object.keys(productImages).join(', '))

	// Create products
	const products = await Promise.all(
		[
			{
				name: 'Premium Wireless Headphones',
				description: 'High-quality wireless headphones with noise cancellation',
				longDescription: `
					<h2>Immersive Sound Quality</h2>
					<p><em>Experience</em> crystal-clear audio with these <strong>premium wireless headphones</strong>. Designed for audiophiles, they deliver <strong>deep bass</strong> and <em>crisp highs</em>, ensuring an immersive listening experience.</p>
					
					<h3>Comfort and Convenience</h3>
					<p>Enjoy all-day comfort with plush earcups and an adjustable headband. The built-in Bluetooth technology allows for seamless connectivity to your devices, while the long-lasting battery ensures hours of uninterrupted music.</p>
					<hr />
					<h4>Key Features:</h4>
					<ul>
						<li><strong>Noise Cancelling:</strong> Immerse yourself in your music without distractions.</li>
						<li><strong>Wireless Bluetooth:</strong> Enjoy freedom of movement with seamless connectivity.</li>
					</ul>
					<p>These headphones are perfect for anyone who appreciates high-quality audio and comfort.</p>
				`,
				priceCents: 29900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Premium Wireless Headphones',
					description:
						'High-quality wireless headphones with noise cancellation',
				}),
				stock: 3,
				trending: true,
				images: JSON.stringify(
					[1, 2, 3, 4].map((i) => productImages[`headphone-${i}.png`])
				),
			},
			{
				name: 'Smart Fitness Watch',
				description: 'Track your health and fitness goals with precision',
				longDescription: `
					<h2>Your Personal Fitness Companion</h2>
					<p>Achieve your fitness goals with the <strong>Smart Fitness Watch</strong>. This advanced wearable tracks your <em>heart rate</em>, <strong>steps</strong>, and <em>sleep patterns</em>, providing valuable insights into your overall health.</p>
					
					<h3>Stay Connected On the Go</h3>
					<p>Receive notifications, control your music, and stay connected with the built-in smart features. The long-lasting battery ensures you can wear it all day and night without needing a recharge.</p>
					<hr />
					<h4>Key Features:</h4>
					<ul>
						<li><strong>Heart Rate Tracking:</strong> Monitor your heart rate in real-time.</li>
						<li><strong>Sleep Analysis:</strong> Understand your sleep patterns and improve your sleep quality.</li>
					</ul>
					<p>The Smart Fitness Watch is your ultimate fitness companion.</p>
				`,
				priceCents: 19900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Smart Fitness Watch',
					description: 'Advanced fitness tracking watch',
				}),
				stock: 5,
				trending: true,
				images: JSON.stringify(
					[1, 2, 3].map((i) => productImages[`fitness-watch-${i}.png`])
				),
			},
			{
				name: 'Portable Power Bank',
				description: '20000mAh high-capacity portable charger',
				longDescription: `
					<h2>Power On the Go</h2>
					<p>Never run out of battery again with this <strong>20000mAh high-capacity portable power bank</strong>. Perfect for travelers, commuters, and anyone who needs a reliable power source on the go.</p>
					
					<h3>Charge All Your Devices</h3>
					<p>With multiple USB ports, you can charge your smartphone, tablet, and other devices simultaneously. The compact and lightweight design makes it easy to carry in your bag or pocket.</p>
					<hr />
					<h4>Key Features:</h4>
					<ul>
						<li><strong>Fast Charging:</strong> Quickly charge your devices when you're on the move.</li>
						<li><strong>Compact Design:</strong> Easily fits in your bag or pocket for convenient portability.</li>
					</ul>
					<p>Stay powered up wherever you go with this reliable power bank.</p>
				`,
				priceCents: 4900,
				jsonLd: JSON.stringify({
					'@type': 'Product',
					name: 'Portable Power Bank',
					description: '20000mAh high-capacity portable charger',
				}),
				stock: 10,
				images: JSON.stringify(
					[1, 2, 3, 4].map((i) => productImages[`power-bank-${i}.png`])
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

	console.log(
		'Uploading post images to storage service. This may take a few minutes...'
	)
	const postImages = await uploadSeedImages(
		path.join(__dirname, 'images', 'posts')
	)
	console.log('Uploaded images:', Object.keys(postImages).join(', '))
	// Create blog posts
	await Promise.all(
		[
			{
				title: 'Top Tech Trends for 2025',
				content: `<p>As we move further into 2025, we're seeing exciting developments in consumer electronics. <strong>Artificial intelligence</strong> is becoming more integrated into our daily lives, from smart home devices to personalized recommendations. Expect to see more <em>innovative</em> gadgets that enhance convenience and efficiency.</p><div data-youtube-video=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube-nocookie.com/embed/CM2TgIEcvpc?controls=0" start="0"></iframe></div><p>Another major trend is the rise of <code>sustainable technology</code>. Companies are prioritizing eco-friendly materials and energy-efficient designs to reduce their environmental impact. Look out for products that not only perform well but also contribute to a greener future. <a target="_blank" rel="noopener noreferrer nofollow" href="#">Learn more about sustainable tech.</a></p>`,
				slug: 'top-tech-trends-2025',
				state: 'published' as BlogPostState,
				coverImage: JSON.stringify([postImages['top-tech-trends-2025.png']]),
			},
			{
				title: 'How to Choose the Right Headphones',
				content: `<p>With so many options available, choosing the perfect headphones can be overwhelming. Consider what you'll primarily use them for: <strong>commuting</strong>, <em>working out</em>, or relaxing at home. Each scenario benefits from different features like noise cancellation, water resistance, or superior sound quality.</p><img src="https://flashboard-demo-public.nyc3.cdn.digitaloceanspaces.com/5a73cd20-2069-4483-8caf-b9e450ed5b97.png" title="headphone" alt="headphone"><p>Don't underestimate the importance of comfort. Look for headphones with plush earcups and an adjustable headband to ensure a snug fit.</p><ul><li><p><strong>Over-ear headphones</strong> provide the best sound isolation.</p></li><li><p><strong>On-ear headphones</strong> are more compact and lightweight.</p></li><li><p><strong>In-ear headphones</strong> are great for portability.</p></li></ul><p><a target="_blank" rel="noopener noreferrer nofollow" href="#">Read our full guide.</a></p>`,
				slug: 'choose-right-headphones',
				state: 'published' as BlogPostState,
				coverImage: JSON.stringify([postImages['choose-right-headphones.png']]),
			},
			{
				title: 'Upcoming Product Launch',
				content:
					"<p>We're excited to announce our newest product line coming this summer! Get ready for a revolutionary device that will change the way you interact with technology. <code>Stay tuned for more details</code>, including sneak peeks and exclusive behind-the-scenes content.</p><p>Our team has been working tirelessly to create something truly special. We're confident that you'll love the innovative features and sleek design of our upcoming product. <mark>Sign up for our newsletter</mark> to be the first to know when it's available! Here's a sneak peek at our new API:</p><pre><code class='language-javascript'>async function fetchData() {\n  const response = await fetch('/api/newProduct');\n  const data = await response.json();\n  console.log(data);\n}\n</code></pre><ol><li>Early bird discounts</li><li>Exclusive content</li><li>Giveaways</li></ol></p>",
				slug: 'upcoming-product-launch',
				state: 'draft' as BlogPostState,
				coverImage: JSON.stringify([postImages['upcoming-product-launch.png']]),
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
			const totalCents = Number.parseInt(
				faker.finance.amount({ min: 1000, max: 50000 }),
				10
			)
			return await db()
				.insertInto('orders')
				.values({
					userId: user.id,
					totalCents,
					stripeResponse: JSON.stringify({
						id: `ch_mockCartId_${randomUUID()}`,
						status: faker.helpers.shuffle([
							'succeeded',
							'pending',
							'failed',
						])[0],
						amount: totalCents,
						date: faker.date.past().toISOString().split('T')[0],
					}),
				})
				.execute()
		})
	)

	console.log(
		'Uploading post images to storage service. This may take a few minutes...'
	)
	const contentImages = await uploadSeedImages(
		path.join(__dirname, 'images', 'content')
	)
	console.log('Uploaded images:', Object.keys(contentImages).join(', '))
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
				value: JSON.stringify([contentImages['home-hero-image.jpeg']]),
			},
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
