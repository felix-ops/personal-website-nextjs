import StoriesPage from "@/components/pages/stories-page";

export default function TagStoriesPage({ params }: { params: { tag: string } }) {
	const tag = typeof params.tag === "string" ? params.tag.toLowerCase() : params.tag;
	return (
		<main>
			<StoriesPage tag={tag} />
		</main>
	);
}
