"use client";

import Navigation from "@/components/organisms/navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { posts } from "@/data/posts-data";
import { PostCard } from "@/components/molecules/post-card";
import Footer from "@/components/organisms/footer";

export default function PostsPage({ tag = "all" }: { tag?: string }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState(tag.toLowerCase());

	const allTags = useMemo(() => {
		const tagSet = new Set<string>();
		posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
		return ["all", ...Array.from(tagSet)];
	}, []);

	const filteredProjects = posts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesTag = selectedTag === "all" || post.tags.map((t) => t.toLowerCase()).includes(selectedTag);
		return matchesSearch && matchesTag;
	});

	// Find the original case tag for display
	const displayTag =
		selectedTag === "all" ? "All Posts" : allTags.find((t) => t.toLowerCase() === selectedTag) || selectedTag;

	return (
		<div className="min-h-screen">
			<Navigation />

			{/* Header */}
			<section className="pt-24 pb-16 bg-color1">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl font-bold text-color2 mb-6">{displayTag}</h1>
						<p className="text-xl text-color4 mb-8">
							Explore my complete portfolio of 3D visualizations, simulations, and creative projects.
						</p>

						{/* Search and Filter */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
							<div className="relative flex-1 w-full">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-color4 h-4 w-4" />
								<Input
									placeholder="Search projects..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 w-full"
								/>
							</div>
							<div className="flex items-center gap-2">
								<Filter className="text-color4 h-4 w-4" />
								<Select value={selectedTag} onValueChange={(value) => setSelectedTag(value as typeof selectedTag)}>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{allTags.map((tag) => (
											<SelectItem key={tag} value={tag}>
												{tag === "all" ? "All Tags" : tag}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Projects Grid */}
			<section className="py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-7xl mx-auto">
						{filteredProjects.length === 0 ? (
							<div className="text-center py-16">
								<p className="text-color4 text-lg">No projects found matching your criteria.</p>
							</div>
						) : (
							<>
								<div className="mb-8">
									<p className="text-color4">
										Showing {filteredProjects.length} of {posts.length} projects
									</p>
								</div>
								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
									{filteredProjects.map((project) => (
										<PostCard key={project.id} post={project} />
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</section>
			{/* Footer */}
			<Footer />
		</div>
	);
}
