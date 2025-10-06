import { Button } from "@/components/atoms/button";
import Link from "next/link";
import { posts, featuredPostIds } from "@/data/posts-data";
import { PostCard } from "@/components/molecules/post-card";

export default function PostsSection() {
	// Get featured posts in the specified order
	const featuredPosts = featuredPostIds
		.map((id) => posts.find((post) => post.id === id))
		.filter((post) => post) as typeof posts;

	return (
		<section id="posts" className="py-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-color2 mb-4 ">Featured Posts</h2>
						<p className="text-lg text-color4 max-w-2xl mx-auto">
							Here you can find my hobby projects and personal blogs. Feel free to browse and explore my archive!
						</p>
					</div>

					{/* Posts Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{featuredPosts.map((post) => (
							<PostCard key={post.id} post={post} />
						))}
					</div>

					<div className="text-center mt-12">
						<Link href="/posts">
							<Button className="bg-color2 text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors duration-200 cursor-pointer">
								View All Posts
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
