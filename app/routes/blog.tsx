import type { Route } from "./+types/blog";
import { PostThumb } from "~/ui/post-thumb";

export async function loader() {
	const posts = [
		{
			id: 1,
			title: "Boost your conversion rate",
			slug: "boost-your-conversion-rate",
			categories: "Marketing",
			description:
				"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.",
			date: "Mar 16, 2020",
			datetime: "2020-03-16",
			author: {
				name: "Michael Foster",
				role: "Co-Founder / CTO",
				imageUrl:
					"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
		},
		{
			id: 2,
			title: "How to use search engine optimization to drive sales",
			slug: "how-to-use-search-engine-optimization-to-drive-sales",
			categories: "Sales, Team",
			description:
				"Optio sit exercitation et ex ullamco aliquid explicabo. Dolore do ut officia anim non ad eu. Magna laboris incididunt commodo elit ipsum.",
			date: "Mar 16, 2020",
			datetime: "2020-03-16",
			author: {
				name: "Lindsay Walton",
				role: "Front-end Developer",
				imageUrl:
					"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
		},
	];
	return { posts };
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { posts } = loaderData;
	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl">
					<h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
						From the blog
					</h2>
					<p className="mt-2 text-lg/8 text-gray-600">
						Learn how to grow your business with our expert advice.
					</p>
					<div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
						{posts.map((post) => (
							<PostThumb post={post} key={post.id} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
