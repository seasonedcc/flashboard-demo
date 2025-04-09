import { Link, href } from "react-router";
import type { Route } from "../routes/+types/blog";

function PostThumb({
	post,
}: { post: Route.ComponentProps["loaderData"]["posts"][number] }) {
	return (
		<article className="flex max-w-xl flex-col items-start justify-between">
			<div className="flex items-center gap-x-4 text-xs">
				<time dateTime={post.datetime} className="text-gray-500">
					{post.date}
				</time>
				{post.categories.split(",").map((category) => (
					<span
						key={category.trim()}
						className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600"
					>
						{category.trim()}
					</span>
				))}
			</div>
			<div className="group relative">
				<h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
					<Link to={href("/blog/:slug", { slug: post.slug })}>
						<span className="absolute inset-0" />
						{post.title}
					</Link>
				</h3>
				<p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
					{post.description}
				</p>
			</div>
			<div className="relative mt-8 flex items-center gap-x-4">
				<img
					alt=""
					src={post.author.imageUrl}
					className="size-10 rounded-full bg-gray-50"
				/>
				<div className="text-sm/6">
					<p className="font-semibold text-gray-900">
						<span className="absolute inset-0" />
						{post.author.name}
					</p>
					<p className="text-gray-600">{post.author.role}</p>
				</div>
			</div>
		</article>
	);
}

export { PostThumb };
