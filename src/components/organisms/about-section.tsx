"use client";

import Link from "next/link";
import Mascot3D, { MascotRef } from "./mascot-3d";
import { useRef, useEffect } from "react";
import { mapRange } from "@/lib/utils";

export default function AboutSection() {
	const mascotRef = useRef<MascotRef>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const mousePosRef = useRef<{ x: number; y: number } | null>(null);

	const skills = [
		"Software Engineering",
		"3D Graphics",
		"ML / AI",
		"Embedded Systems",
		"Computational Physics",
		"Simulations",
	];

	const updateMascot = () => {
		if (typeof window === "undefined" || window.innerWidth < 1024 || !containerRef.current || !mousePosRef.current) {
			// If unwanted state, reset (optional, or just do nothing)
			return;
		}

		const rect = containerRef.current.getBoundingClientRect();
		const { x: clientX, y: clientY } = mousePosRef.current;

		// Check if mouse is roughly inside the container (with some buffer? or strict?)
		// Since we use this on scroll, strictly checking bounds is good to auto-reset if scrolled away
		// However, handleMouseMove logic didn't strict check bounds, but it's implicit in mousemove on element.

		let x = (clientX - rect.left) / rect.width;
		let y = (clientY - rect.top) / rect.height;

		// If out of bounds, reset and return
		if (x < 0 || x > 1 || y < 0 || y > 1) {
			mascotRef.current?.reset();
			return;
		}

		x = mapRange(x, [0, 1], [0.75, 1.0]);
		y = mapRange(y, [0, 1], [0.3, 0.8]);

		mascotRef.current?.setInteraction(x, y);
	};

	useEffect(() => {
		const handleScrollOrResize = () => {
			if (mousePosRef.current) {
				updateMascot();
			}
		};

		window.addEventListener("scroll", handleScrollOrResize, { passive: true });
		window.addEventListener("resize", handleScrollOrResize, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScrollOrResize);
			window.removeEventListener("resize", handleScrollOrResize);
		};
	}, []);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		mousePosRef.current = { x: e.clientX, y: e.clientY };
		updateMascot();
	};

	const handleMouseLeave = () => {
		mousePosRef.current = null;
		mascotRef.current?.reset();
	};

	return (
		<section id="about" className="py-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-8xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-color2 mb-4">About Me</h2>
						<p className="text-lg text-color4 max-w-2xl mx-auto">Passionate about Science, Engineering and Art.</p>
					</div>

					<div className="grid lg:grid-cols-7 gap-8 items-center">
						<div className="lg:col-span-3 animate-slide-up">
							<div className="relative max-w-md h-100 w-100 mx-auto">
								<Mascot3D ref={mascotRef} />
							</div>
						</div>

						<div
							ref={containerRef}
							onMouseMove={handleMouseMove}
							onMouseLeave={handleMouseLeave}
							className="lg:col-span-4 max-w-2xl animate-slide-up bg:color1/0 md:bg-color6 px-4 md:px-12 py-8 rounded-4xl"
						>
							<div className="space-y-6">
								<div>
									<h3 className="text-2xl font-semibold text-color2 mb-4">My Journey</h3>
									<p className="text-color4 leading-relaxed mb-4 max-w-xl">
										I started my journey in Physics by pursuing a Master Degree, At the end of 2022 with{" "}
										<Link
											href="https://www.spacekidzindia.in/"
											target="_blank"
											rel="noopener noreferrer"
											className="text-color4 font-semibold"
										>
											SKI{" "}
										</Link>
										I got the opportunity to work on a Nano satellite project called{" "}
										<Link
											href="https://www.nanosats.eu/sat/azaadisat-2"
											target="_blank"
											rel="noopener noreferrer"
											className="text-color4 font-semibold"
										>
											AzaadiSAT-2{". "}
										</Link>
										At that point I was still a beginner had to learn a lot from coding to engineering for mission
										critical systems and I loved every part of it.
									</p>
									<p className="text-color4 leading-relaxed mb-4 max-w-xl">
										And by the midst of 2023, I decided to take my science and tech interests to good use by
										contributing for impactful missions, so I teamed up with{" "}
										<Link
											href="https://monkeyscience.io"
											target="_blank"
											rel="noopener noreferrer"
											className="text-color4 font-semibold"
										>
											Monkey Science{" "}
										</Link>
										and built 300+ 3D simulations for educational content.
									</p>
									<p className="text-color4 leading-relaxed max-w-xl">
										Other than my work I am also more passionate about Japanese, In this site I share my personal{" "}
										<Link href="/posts/blogs" className="text-color4 font-semibold ">
											Blogs{" "}
										</Link>
										,{" "}
										<Link href="/posts/projects" className="text-color4 font-semibold ">
											Projects{" "}
										</Link>{" "}
										and my progress so far. Feel free to browse and explore through my site ようこそ！
									</p>
								</div>

								<div>
									<h4 className="text-lg font-semibold text-color2 mb-3">Core Skills</h4>
									<div className="grid grid-cols-2 gap-3">
										{skills.map((skill, index) => (
											<div key={index} className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-color4 rounded-full"></div>
												<span className="text-color3">{skill}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
