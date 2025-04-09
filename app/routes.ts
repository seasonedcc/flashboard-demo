import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("products", "routes/products.tsx"),
	route("blog", "routes/blog.tsx"),
	route("products/:id", "routes/product.tsx"),
	route("blog/:slug", "routes/blog-post.tsx"),
] satisfies RouteConfig;
