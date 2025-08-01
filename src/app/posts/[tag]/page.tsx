import PostsPage from "@/components/pages/posts-page";
import { tag, tagValues } from "@/data/post-types";

export default async function TagPostsPage({ params }: { params: Promise<{ tag: string }> }) {
	const { tag: tagParam } = await params;

	// Convert the URL parameter to the correct case and validate it's a valid tag
	const normalizedTag = tagParam.charAt(0).toUpperCase() + tagParam.slice(1).toLowerCase();
	const tagValue = tagValues.includes(normalizedTag as tag) ? (normalizedTag as tag) : "All";

	return (
		<main>
			<PostsPage tag={tagValue} />
		</main>
	);
}
