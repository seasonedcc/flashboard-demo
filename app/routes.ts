import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
	index('routes/home.tsx'),
	route('products', 'routes/products.tsx'),
	route('blog', 'routes/blog.tsx'),
	route('products/:productId', 'routes/product.tsx'),
	route('blog/:slug', 'routes/blog-post.tsx'),
	route('order/:orderId', 'routes/order.tsx'),

	// RESOURCE ROUTES
	route('image/:bucketName/:key', 'routes/image.ts'),

	// API ROUTES
	route('cart/remove/:lineItemId', 'routes/cart-remove.ts'),
] satisfies RouteConfig
