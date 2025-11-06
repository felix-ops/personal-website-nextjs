import { baseURL } from "@/data/information";
import { MetadataRoute } from "next";
import { posts } from "@/data/posts-data";
import { tagValues } from "@/data/post-types";

const priority = {
	root: 1.0,
	category: 0.9,
	project: 0.8,
	blog: 0.7,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Filter non-hidden projects (posts with "Projects" tag)
	const projects = posts.filter(
		(post) => post.tags.includes("Projects") && !post.isHidden && post.link.startsWith("/projects/"),
	);

	// Filter non-hidden blogs (posts with "Blogs" tag)
	const blogs = posts.filter(
		(post) => post.tags.includes("Blogs") && !post.isHidden && post.link.startsWith("/blogs/"),
	);

	// Build sitemap entries
	const projectEntries = projects.map((project) => ({
		url: `${baseURL}${project.link}`,
		priority: priority.project,
	}));

	const blogEntries = blogs.map((blog) => ({
		url: `${baseURL}${blog.link}`,
		priority: priority.blog,
	}));

	// Build post tag pages entries
	const postTagEntries = [
		...tagValues.map((tag) => ({
			url: `${baseURL}/posts/${tag.toLowerCase()}`,
			priority: priority.category,
		})),
	];

	return [
		{
			url: `${baseURL}`,
			priority: priority.root,
		},
		...postTagEntries,
		...projectEntries,
		...blogEntries,
	];
}
