"use client";

import Navigation from "@/components/organisms/navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { stories, storyCategories } from "@/data/stories-data";
import { StoryCard } from "@/components/molecules/story-card";
import { info } from "@/data/information";

export default function StoriesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	const filteredProjects = stories.filter((story) => {
		const matchesSearch =
			story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			story.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === "all" || story.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="min-h-screen bg-white">
			<Navigation />

			{/* Header */}
			<section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 to-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">All Projects</h1>
						<p className="text-xl text-slate-600 mb-8">
							Explore my complete portfolio of 3D visualizations, simulations, and creative projects.
						</p>

						{/* Search and Filter */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
							<div className="relative flex-1 w-full">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
								<Input
									placeholder="Search projects..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 w-full"
								/>
							</div>
							<div className="flex items-center gap-2">
								<Filter className="text-slate-400 h-4 w-4" />
								<Select value={selectedCategory} onValueChange={setSelectedCategory}>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{storyCategories.map((category) => (
											<SelectItem key={category} value={category}>
												{category === "all" ? "All Categories" : category}
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
								<p className="text-slate-500 text-lg">No projects found matching your criteria.</p>
							</div>
						) : (
							<>
								<div className="mb-8">
									<p className="text-slate-600">
										Showing {filteredProjects.length} of {stories.length} projects
									</p>
								</div>
								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
									{filteredProjects.map((project) => (
										<StoryCard key={project.id} story={project} />
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-slate-900 text-white py-8">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-6xl mx-auto text-center">
						<p className="text-slate-400">
							© {info.currentYear} Bhuvaneshwaran M. All rights reserved. | Crafted with passion.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
