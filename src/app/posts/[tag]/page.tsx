import PostsPage from "@/components/pages/posts-page";

export default function TagPostsPage({ params }: { params: { tag: string } }) {
	const tag = typeof params.tag === "string" ? params.tag.toLowerCase() : params.tag;
	return (
		<main>
			<PostsPage tag={tag} />
		</main>
	);
}
