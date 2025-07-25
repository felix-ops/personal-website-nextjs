import PostsPage from "@/components/pages/posts-page";
import { tag } from "@/data/tag";

export default async function TagPostsPage({ params }: { params: Promise<{ tag: tag }> }) {
	const { tag: tagParam } = await params;
	const tagValue = typeof tagParam === "string" ? tagParam.toLowerCase() : tagParam;

	return (
		<main>
			<PostsPage tag={tagValue} />
		</main>
	);
}
