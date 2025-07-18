import { Button } from "@/components/atoms/button";
import Link from "next/link";
import { stories } from "@/data/stories-data";
import { StoryCard } from "@/components/molecules/story-card";

export default function StoriesSection() {
	return (
		<section id="stories" className="py-20 bg-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Recent Stories</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Here you can find my hobby projects and personal blogs. Feel free to browse and explore my archive!
						</p>
					</div>

					{/* Stories Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{stories.map((story) => (
							<StoryCard key={story.id} story={story} />
						))}
					</div>

					<div className="text-center mt-12">
						<Link href="/stories">
							<Button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors duration-200 cursor-pointer">
								View All Works
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
