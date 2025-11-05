import type { Metadata } from "next";
import BlogPage from "@/components/pages/blog-page";
import { posts } from "@/data/posts-data";

export default BlogPage;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const id = slug.toLowerCase();

	const blog = posts.find((p) => {
		const isBlogTag = Array.isArray(p.tags) && p.tags.includes("Blogs");
		const postId = typeof p.id === "string" ? p.id.toLowerCase() : "";
		return isBlogTag && postId === id;
	});

	const title = blog?.title ?? "Blogs";
	const description = blog?.description ?? "Read a blog post on Buva.io.";

	const canonicalPath = (typeof blog?.link === "string" && blog.link) || (slug ? `/blogs/${slug}` : "/blogs");

	return {
		title,
		description,
		alternates: {
			canonical: `https://buva.io${canonicalPath}`,
		},
		openGraph: {
			title,
			description,
			url: `https://buva.io${canonicalPath}`,
			siteName: "Buva.io",
			type: "website",
		},
	};
}
