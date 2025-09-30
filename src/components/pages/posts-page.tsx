"use client";

import Navigation from "@/components/organisms/navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { posts } from "@/data/posts-data";
import { tag, tagValues } from "@/data/post-types";
import { PostCard } from "@/components/molecules/post-card";
import Footer from "@/components/organisms/footer";
import { useRouter } from "next/navigation";

export default function PostsPage({ tag = "All" }: { tag?: tag | "All" }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState(tag);
	const router = useRouter();

	const allTags = ["All", ...tagValues];

	const handleTagChange = (value: string) => {
		const newTag = value as tag | "All";
		setSelectedTag(newTag);

		// Navigate to the appropriate URL
		if (newTag === "All") {
			router.push("/posts/all");
		} else {
			router.push(`/posts/${newTag.toLowerCase()}`);
		}
	};

	const filteredProjects = posts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
			post.date.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesTag = selectedTag === "All" || post.tags.includes(selectedTag as tag);
		const isMatchesVisible = !post.isHidden;
		return matchesSearch && matchesTag && isMatchesVisible;
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
										className="pl-10 w-90 h-10"
									/>
								</div>
								<div className="flex items-center gap-2">
									<Select value={selectedTag} onValueChange={handleTagChange}>
										<SelectTrigger className="w-40 h-10">
											<Filter className="text-color4 h-4 w-4" />
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
