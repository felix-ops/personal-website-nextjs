import PostsPage from "@/components/pages/posts-page";
import { tag, tagValues } from "@/data/post-types";

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
