import {
	type RouteConfig,
	index,
	prefix,
	route,
} from '@react-router/dev/routes'

export default [
	index('routes/home.tsx'),
	route('products', 'routes/products.tsx'),
	route('blog', 'routes/blog.tsx'),
	route('products/:productId', 'routes/product.tsx'),
	route('blog/:slug', 'routes/blog-post.tsx'),

	// RESOURCE ROUTES
	route('image/:bucketName/:key', 'routes/image.ts'),

	// API ROUTES
	...prefix('cart', [route('remove/:lineItemId', 'routes/cart-remove.ts')]),
] satisfies RouteConfig
