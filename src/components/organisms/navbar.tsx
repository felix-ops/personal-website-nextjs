"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "@/lib/utils";
import Link from "next/link";
import { personalInfo } from "@/data/information";

export default function Navigation() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	// Handle scrolling after navigation
	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			scrollToSection(hash);
		}
	}, [pathname]);

	const handleNavClick = (href: string) => {
		if (href.startsWith("#")) {
			// If not on homepage, navigate to homepage with hash
			if (pathname !== "/") {
				router.push(`/${href}`);
			} else {
				// If already on homepage, just scroll to section
				scrollToSection(href);
			}
		}
		setMobileMenuOpen(false);
	};

	const navItems = [
		{ href: "/posts/projects", label: "Projects", isSection: false },
		{ href: "/posts/blogs", label: "Blogs", isSection: false },
		{ href: "#contact", label: "Contact", isSection: true },
	];

	return (
		<nav className="fixed top-0 left-0 right-0 lg:left-30 lg:right-30 bg-color1 md:bg-color1/85 backdrop-blur-sm border-slate-200 z-50 rounded-b-2xl md:rounded-full shadow-md md:shadow-lg">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 ">
					<div className="flex-shrink-0">
						<Link href="/">
							<h1 className="font-[700] text-2xl text-color4 cursor-pointer px-2">{personalInfo.name}</h1>
						</Link>
					</div>
					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-2">
							{navItems.map((item) =>
								item.isSection ? (
									<button
										key={item.href}
										onClick={() => handleNavClick(item.href)}
										className="font-[600] text-lg text-color2 transition-colors duration-200 cursor-pointer rounded-full hover:bg-color2 hover:text-white px-4 py-2 hover:shadow-md"
									>
										{item.label}
									</button>
								) : (
									<Link
										key={item.href}
										href={item.href}
										className="font-[600] text-lg text-color2 transition-colors duration-200 cursor-pointer rounded-full hover:bg-color2 hover:text-white px-4 py-2 hover:shadow-md"
										onClick={() => setMobileMenuOpen(false)}
									>
										{item.label}
									</Link>
								),
							)}
						</div>
					</div>
					{/* Mobile menu button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="text-slate-700 "
						>
							{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</Button>
					</div>
				</div>
				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden bg-color1">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							{navItems.map((item) =>
								item.isSection ? (
									<button
										key={item.href}
										onClick={() => handleNavClick(item.href)}
										className="block w-full text-left px-3 py-2 text-color3 font-semibold cursor-pointer"
									>
										{item.label}
									</button>
								) : (
									<Link
										key={item.href}
										href={item.href}
										className="block w-full text-left px-3 py-2 text-color3 font-semibold cursor-pointer"
										onClick={() => setMobileMenuOpen(false)}
									>
										{item.label}
									</Link>
								),
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
