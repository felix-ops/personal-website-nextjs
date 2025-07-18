"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "@/lib/utils";
import Link from "next/link";

export default function Navigation() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	// Handle scrolling after navigation
	useEffect(() => {
		// Check if there's a hash in the URL (e.g., /#about)
		const hash = window.location.hash;
		if (hash) {
			scrollToSection(hash); // Scroll to the section after page load
		}
	}, [pathname]); // Re-run when pathname changes

	const handleNavClick = (href: string) => {
		if (href.startsWith("#")) {
			// If not on homepage, navigate to homepage with hash
			if (pathname !== "/") {
				router.push(`/${href}`); // Navigate to /#about, /#experience, etc.
			} else {
				// Already on homepage, just scroll
				scrollToSection(href);
			}
		}
		setMobileMenuOpen(false);
	};

	const navItems = [
		{ href: "#about", label: "About", isSection: true },
		{ href: "/stories", label: "Projects", isSection: false },
		{ href: "#contact", label: "Contact", isSection: true },
	];

	return (
		<nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex-shrink-0">
						<Link href="/">
							<h1 className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors duration-200">
								Bhuvaneshwaran M
							</h1>
						</Link>
					</div>
					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-8">
							{navItems.map((item) =>
								item.isSection ? (
									<button
										key={item.href}
										onClick={() => handleNavClick(item.href)}
										className="text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium cursor-pointer"
									>
										{item.label}
									</button>
								) : (
									<Link
										key={item.href}
										href={item.href}
										className="text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium cursor-pointer"
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
							className="text-slate-700 hover:text-blue-600"
						>
							{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</Button>
					</div>
				</div>
				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden bg-white border-t border-slate-200">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							{navItems.map((item) =>
								item.isSection ? (
									<button
										key={item.href}
										onClick={() => handleNavClick(item.href)}
										className="block w-full text-left px-3 py-2 text-slate-700 hover:text-blue-600 transition-colors duration-200"
									>
										{item.label}
									</button>
								) : (
									<Link
										key={item.href}
										href={item.href}
										className="block w-full text-left px-3 py-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
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
