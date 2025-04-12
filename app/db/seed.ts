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
				stock: 50,
				trending: true,
				images: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '1017076f-5332-4cad-9d04-2f85f5b58cfe',
						filename: 'headphones-1.png',
						contentType: 'image/png',
						size: 335590,
					},
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '53f6f890-96c2-4f46-8365-9102a386ba52',
						filename: 'headphones-2.png',
						contentType: 'image/png',
						size: 227747,
					},
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: 'cf279a68-ea0d-42bf-bb1c-4ff716247749',
						filename: 'headphones-3.png',
						contentType: 'image/png',
						size: 252985,
					},
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '161eb8fe-928e-4219-b50c-909a63826a8f',
						filename: 'headphones-4.png',
						contentType: 'image/png',
						size: 498226,
					},
				]),
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
				stock: 75,
				trending: true,
				images: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '218ee044-0a28-4e89-ab90-2316a8f05938',
						filename: 'watch-1.png',
						contentType: 'image/png',
						size: 260576,
					},
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '3efe53ed-f8f9-40d5-93b5-11afcc00eb12',
						filename: 'watch-2.png',
						contentType: 'image/png',
						size: 350211,
					},
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: 'a1bbc17c-a298-43a3-9b76-69271d24fb3b',
						filename: 'watch-3.png',
						contentType: 'image/png',
						size: 276080,
					},
				]),
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
				stock: 100,
				images: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '91f499df-173a-49dc-a936-ba89d71d9681',
						filename: 'powerbank-1.png',
						contentType: 'image/png',
						size: 519342,
					},
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '7b19cdd2-baac-4eb5-8b4e-f1fa437f91a6',
						filename: 'powerbank-2.png',
						contentType: 'image/png',
						size: 389903,
					},
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '00a98cf3-10cd-417d-9b48-08268fcdacaa',
						filename: 'powerbank-3.png',
						contentType: 'image/png',
						size: 326957,
					},
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '25207a41-9006-4fb6-8112-2cb8f2d0d7b5',
						filename: 'powerbank-4.png',
						contentType: 'image/png',
						size: 428567,
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
				content: `<p>As we move further into 2025, we're seeing exciting developments in consumer electronics. <strong>Artificial intelligence</strong> is becoming more integrated into our daily lives, from smart home devices to personalized recommendations. Expect to see more <em>innovative</em> gadgets that enhance convenience and efficiency.</p><div data-youtube-video=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube-nocookie.com/embed/CM2TgIEcvpc?controls=0" start="0"></iframe></div><p>Another major trend is the rise of <code>sustainable technology</code>. Companies are prioritizing eco-friendly materials and energy-efficient designs to reduce their environmental impact. Look out for products that not only perform well but also contribute to a greener future. <a target="_blank" rel="noopener noreferrer nofollow" href="#">Learn more about sustainable tech.</a></p>`,
				slug: 'top-tech-trends-2025',
				state: 'published' as BlogPostState,
				coverImage: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '7cda3e74-9d48-497c-9f27-fc73e9ea5977',
						filename: 'image3.png',
						contentType: 'image/png',
						size: 1599570,
					},
				]),
			},
			{
				title: 'How to Choose the Right Headphones',
				content: `<p>With so many options available, choosing the perfect headphones can be overwhelming. Consider what you'll primarily use them for: <strong>commuting</strong>, <em>working out</em>, or relaxing at home. Each scenario benefits from different features like noise cancellation, water resistance, or superior sound quality.</p><img src="https://xvoyrekmflgvgpcmsnwy.supabase.co/storage/v1/object/public/public-files/5a73cd20-2069-4483-8caf-b9e450ed5b97" title="headphone" alt="headphone"><p>Don't underestimate the importance of comfort. Look for headphones with plush earcups and an adjustable headband to ensure a snug fit.</p><ul><li><p><strong>Over-ear headphones</strong> provide the best sound isolation.</p></li><li><p><strong>On-ear headphones</strong> are more compact and lightweight.</p></li><li><p><strong>In-ear headphones</strong> are great for portability.</p></li></ul><p><a target="_blank" rel="noopener noreferrer nofollow" href="#">Read our full guide.</a></p>`,
				slug: 'choose-right-headphones',
				state: 'published' as BlogPostState,
				coverImage: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: '63c00009-21f0-4f2d-8564-5260d3a2f7c1',
						filename: 'image2.png',
						contentType: 'image/png',
						size: 1290330,
					},
				]),
			},
			{
				title: 'Upcoming Product Launch',
				content:
					"<p>We're excited to announce our newest product line coming this summer! Get ready for a revolutionary device that will change the way you interact with technology. <code>Stay tuned for more details</code>, including sneak peeks and exclusive behind-the-scenes content.</p><p>Our team has been working tirelessly to create something truly special. We're confident that you'll love the innovative features and sleek design of our upcoming product. <mark>Sign up for our newsletter</mark> to be the first to know when it's available! Here's a sneak peek at our new API:</p><pre><code class='language-javascript'>async function fetchData() {\n  const response = await fetch('/api/newProduct');\n  const data = await response.json();\n  console.log(data);\n}\n</code></pre><ol><li>Early bird discounts</li><li>Exclusive content</li><li>Giveaways</li></ol></p>",
				slug: 'upcoming-product-launch',
				state: 'draft' as BlogPostState,
				coverImage: JSON.stringify([
					{
						flashboardStorage: 'v1',
						serviceName: 's3',
						bucketName: 'files',
						key: 'eecdb334-d93d-492a-900f-709885dd6099',
						filename: 'image.png',
						contentType: 'image/png',
						size: 1279734,
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
