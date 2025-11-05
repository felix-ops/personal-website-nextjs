import PostsPage from "@/components/pages/posts-page";
import { tag, tagValues } from "@/data/post-types";
import { Metadata } from "next";

export default async function TagPostsPage({ params }: { params: Promise<{ tag: string }> }) {
	const { tag: tagParam } = await params;

	// Match against known tags in a case-insensitive way (handles values like "3d" vs "3D")
	const matchedTag = tagValues.find((t) => t.toLowerCase() === tagParam.toLowerCase());
	const tagValue = (matchedTag as tag | undefined) ?? "All";

	return (
		<main>
			<PostsPage tag={tagValue} />
		</main>
	);
}

export function generateStaticParams() {
	return tagValues.map((t) => ({ tag: t }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
	const { tag: tagParam } = await params;
	const matchedTag = tagValues.find((t) => t.toLowerCase() === tagParam.toLowerCase());
	const tagValue = (matchedTag as tag | undefined) ?? "All";

	const titles: Record<string, string> = {
		all: "All Posts",
		projects: "Projects",
		"3d": "3D Visualizations",
		simulation: "Simulations",
		blog: "Blogs",
		japanese: "Japanese Studies",
	};

	const descriptions: Record<string, string> = {
		all: "Explore all posts and updates from me — projects, simulations, blogs, and more.",
		projects: "Here I'll share interesting projects and cool experiments I do.",
		blog: "Read tech insights and personal updates from here!",
		"3d": "Experience my 3D experiments and interactive visualizations.",
		simulation: "Explore physics and simulation-based projects I worked with.",
		japanese: "Dive into my Japanese learning and cultural projects.",
	};

	function formatTag(tag: string) {
		return tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
	}
	const readableTag = formatTag(tagValue);

	const title = titles[tagValue.toLowerCase()] ?? `${readableTag} | Buva.io`;
	const description =
		descriptions[tagValue.toLowerCase()] ?? `Explore ${readableTag}-related posts and resources on Buva.io.`;

	return {
		title,
		description,
		alternates: {
			canonical: `https://buva.io/posts/${tagValue.toLowerCase()}`,
		},
		openGraph: {
			title,
			description,
			url: `https://buva.io/posts/${tagValue.toLowerCase()}`,
			siteName: "Buva.io",
			type: "website",
		},
	};
}
