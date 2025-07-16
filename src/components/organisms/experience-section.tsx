"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { experiences } from "@/data/experience-data";
import { FaXTwitter } from "react-icons/fa6";
import Timeline from "@/components/molecules/timeline";

export default function ExperienceSection() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const labels = experiences.map((exp) => exp.period.split(" - ")[0]);

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev === 0 ? experiences.length - 1 : prev - 1));
	};

	const goToNext = () => {
		setCurrentIndex((prev) => (prev === experiences.length - 1 ? 0 : prev + 1));
	};

	const currentExperience = experiences[currentIndex];

	const socialLinks = [
		{ icon: FaYoutube, href: currentExperience.links.youtube, color: "hover:text-red-500" },
		{ icon: FaLinkedinIn, href: currentExperience.links.linkedin, color: "hover:text-blue-700" },
		{ icon: FaInstagram, href: currentExperience.links.instagram, color: "hover:text-pink-500" },
		{ icon: FaFacebookF, href: currentExperience.links.facebook, color: "hover:text-blue-500" },
		{ icon: FaXTwitter, href: currentExperience.links.x, color: "hover:text-blue-400" },
	];

	return (
		<section
			id="experience"
			className="relative py-16 bg-cover bg-center bg-no-repeat bg-fixed"
			style={{ backgroundImage: `url(${currentExperience.backgroundImage})` }}
		>
			<div className="absolute inset-0 bg-gradient-to-t from-[#000000ff] via-[#000813dd] to-[#00060faa]"></div>
			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 text-left">Experience</h2>
						{/* Navigation Controls - Desktop */}
						<div className="hidden md:flex items-center justify-center gap-6 text-white text-lg">
							{/* Previous */}
							<button
								onClick={goToPrevious}
								disabled={currentIndex === 0}
								className={`group flex items-center gap-2 transition${currentIndex === 0 ? " opacity-50" : ""}`}
							>
								<ChevronLeft
									className={`w-6 h-6 transition${currentIndex === 0 ? "" : " cursor-pointer group-hover:drop-shadow-[0_0_10px_white] "}`}
									strokeWidth={3}
								/>
								<span
									className={`transition${currentIndex === 0 ? "" : " cursor-pointer group-hover:drop-shadow-[0_0_10px_white] "}`}
								>
									Previous
								</span>
							</button>

							{/* Divider */}
							<div className="text-white text-xl">│</div>

							{/* Next */}
							<button
								onClick={goToNext}
								disabled={currentIndex === experiences.length - 1}
								className={`group flex items-center gap-2 transition${currentIndex === experiences.length - 1 ? " opacity-50" : ""}`}
							>
								<span
									className={`transition${currentIndex === experiences.length - 1 ? "" : " cursor-pointer group-hover:drop-shadow-[0_0_10px_white] "}`}
								>
									Next
								</span>
								<ChevronRight
									className={`w-6 h-6 transition${currentIndex === experiences.length - 1 ? "" : " cursor-pointer group-hover:drop-shadow-[0_0_10px_white] "}`}
									strokeWidth={3}
								/>
							</button>
						</div>
					</div>
					{/* Navigation Controls - Mobile */}
					<div className="md:hidden flex justify-between items-center mb-8">
						<Button
							variant="ghost"
							size="sm"
							onClick={goToPrevious}
							disabled={currentIndex === 0}
							className={`text-white hover:bg-white/20 hover:text-white flex items-center gap-2 border-2 border-white rounded-lg${currentIndex === 0 ? " opacity-50" : ""}`}
						>
							<ChevronLeft className="h-5 w-5" />
							<span>
								{
									experiences[currentIndex === 0 ? experiences.length - 1 : currentIndex - 1].period
										.split(" - ")[0]
										.split(" ")[1]
								}
							</span>
						</Button>
						<span className="text-white text-xl font-semibold">{currentExperience.period.split(" - ")[0]}</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={goToNext}
							disabled={currentIndex === experiences.length - 1}
							className={`text-white hover:bg-white/20 hover:text-white flex items-center gap-2 border-2 border-white rounded-lg${currentIndex === experiences.length - 1 ? " opacity-50" : ""}`}
						>
							<span>
								{
									experiences[currentIndex === experiences.length - 1 ? 0 : currentIndex + 1].period
										.split(" - ")[0]
										.split(" ")[1]
								}
							</span>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>

					{/* Content */}
					<div className="flex flex-col md:flex-row gap-8 items-center justify-center">
						{/* Logo */}
						<div className="flex-shrink-0 self-center md:self-start">
							<a href={currentExperience.links.website || "#"} target="_blank" rel="noopener noreferrer">
								<Image
									src={currentExperience.logo}
									alt={`${currentExperience.company} logo`}
									width={80}
									height={80}
									className="w-50 h-30 object-contain"
								/>
							</a>
						</div>

						{/* Info */}
						<div className="flex-1 text-center md:text-right">
							<h3 className="text-2xl md:text-3xl font-bold text-white">
								<a
									href={currentExperience.links.website || "#"}
									target="_blank"
									rel="noopener noreferrer"
									className="transition-colors "
								>
									{currentExperience.company}
								</a>
							</h3>
							<p className="text-lg md:text-xl text-white/90 mb-2">{currentExperience.title}</p>
							<p className="text-white/70 text-base md:text-base">{currentExperience.period}</p>
							<p className="text-white/70 text-base md:text-base mb-5">{currentExperience.location}</p>
						</div>
					</div>
					{/* Details */}
					<div className="flex flex-col mb-12">
						<div
							className="text-white/90 text-base md:text-lg leading-relaxed max-w-6xl mb-10"
							dangerouslySetInnerHTML={{ __html: currentExperience.description }}
						/>
						<div className="flex flex-wrap gap-2 mb-6">
							{currentExperience.tags.map((tag, index) => (
								<Badge
									key={index}
									className="bg-[#2b2e4b] text-white px-3 py-1 rounded-full hover:bg-[#2b2e4b] hover:text-white"
								>
									#{tag}
								</Badge>
							))}
						</div>
						<div className="flex gap-6 mb-2 w-full justify-center md:justify-end">
							{socialLinks.map((link, idx) =>
								link.href ? (
									<a
										key={idx}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className={`text-white transition-colors text-4xl ${link.color}`}
									>
										{link.icon && <link.icon />}
									</a>
								) : null,
							)}
						</div>
					</div>

					{/* Timeline Container */}
					<Timeline
						className="hidden md:block max-w-5xl mx-auto mt-12 mb-10 px-4"
						labels={labels}
						currentIndex={currentIndex}
						setCurrentIndex={setCurrentIndex}
					/>
				</div>
			</div>
		</section>
	);
}
