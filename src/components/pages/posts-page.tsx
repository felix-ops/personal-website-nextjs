"use client";

import Navigation from "@/components/organisms/navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { posts } from "@/data/posts-data";
import { tag, tagValues } from "@/data/tag";
import { PostCard } from "@/components/molecules/post-card";
import Footer from "@/components/organisms/footer";

export default function PostsPage({ tag = "All" }: { tag?: tag | "All" }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState(tag);

	const allTags = ["All", ...tagValues];

	const filteredProjects = posts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesTag = selectedTag === "All" || post.tags.includes(selectedTag as tag);
		return matchesSearch && matchesTag;
	});

	// Find the original case tag for display
	const displayTag = selectedTag === "All" ? "All Posts" : selectedTag;

	// Get the appropriate label for the current tag
	const getTagLabel = (tag: tag | "All") => {
		if (tag === "All") return "posts";
		return tag.toLowerCase();
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />

			{/* Header */}
			<section className="pt-28 pb-16 bg-color1">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-6xl mx-auto">
						{/* Title and Controls Row */}
						<div className="flex flex-col lg:flex-row items-start justify-between gap-6">
							<div className="text-center lg:text-left">
								<h1 className="text-4xl md:text-5xl font-bold text-color2">{displayTag}</h1>
							</div>

							{/* Search and Filter */}
							<div className="flex flex-col sm:flex-row gap-4 items-start pt-2">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-color4 h-4 w-4" />
									<Input
										placeholder={`Search through ${getTagLabel(selectedTag)}...`}
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 w-84 h-10"
									/>
								</div>
								<div className="flex items-center gap-2">
									<Filter className="text-color4 h-4 w-4" />
									<Select value={selectedTag} onValueChange={(value) => setSelectedTag(value as tag | "All")}>
										<SelectTrigger className="w-35 h-10">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{allTags.map((tag) => (
												<SelectItem key={tag} value={tag}>
													{tag === "All" ? "All Posts" : tag}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Description - Only show for "All Tags" */}
						{/* {selectedTag === "All" && (
							<div className="text-center lg:text-left">
								<p className="text-lg text-color4 py-4">
									Explore my complete portfolio of 3D visualizations, simulations, and creative projects.
								</p>
							</div>
						)} */}
					</div>
				</div>
			</section>

			{/* Projects Grid */}
			<section className="py-8 flex-1">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-6xl mx-auto">
						{filteredProjects.length === 0 ? (
							<div className="text-center py-16">
								<p className="text-color4 text-lg">No projects found matching your criteria.</p>
							</div>
						) : (
							<>
								<div className="mb-8">
									<p className="text-color4">
										Showing {filteredProjects.length} of {posts.length} {getTagLabel(selectedTag)}
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
