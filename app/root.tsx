import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	href,
	isRouteErrorResponse,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/app.css";
import { Header } from "./ui/header";
import { Footer } from "./ui/footer";

export const meta: Route.MetaFunction = () => [
	{ title: "Flashboard Demo Store" },
	{ name: "description", content: "Explore this demo" },
];

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export async function loader() {
	const navigation = [
		{ name: "Products", href: href("/products") },
		{ name: "Blog", href: href("/blog") },
	];
	const cartProducts = [
		{
			id: 1,
			name: "Throwback Hip Bag",
			color: "Salmon",
			price: "$90.00",
			quantity: 1,
			imageSrc:
				"https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
			imageAlt:
				"Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.",
		},
		{
			id: 2,
			name: "Medium Stuff Satchel",
			color: "Blue",
			price: "$32.00",
			quantity: 1,
			imageSrc:
				"https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
			imageAlt:
				"Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
		},
	];
	return { navigation, cartProducts };
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				/>
				<Meta />
				<Links />
			</head>
			<body className="bg-white min-h-screen overflow-x-hidden flex flex-col">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App({ loaderData }: Route.ComponentProps) {
	const { cartProducts, navigation } = loaderData;
	return (
		<>
			<Header cartProducts={cartProducts} navigation={navigation} />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<div className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</div>
	);
}
