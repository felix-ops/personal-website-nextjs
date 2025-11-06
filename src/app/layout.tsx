import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/atoms/toaster";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
				/>
			</head>
			<body className="antialiased">
				<QueryProvider>
					{children}
					<Toaster />
				</QueryProvider>
			</body>
		</html>
	);
}

// SEO
export const metadata: Metadata = {
	title: {
		default: "Bhuvaneshwaran M | Buva.io",
		template: "%s | Buva.io",
	},
	metadataBase: new URL("https://buva.io"),
	description: "I'm Bhuvaneshwaran, Science, Technology and Art enthusiast,  this is where I share my work, progress and my passion projects. You'll find a diverse collection of content, including breakdowns 3D art, interactive 3D simulations, and wide rage of web projects. Beyond the technical, I also share personal stories and insights from my ongoing journey as a developer and creator. Whether you're here for the code, the art, or the story, I hope you find something that inspires you.",
	authors: [{ name: "Bhuvaneshwaran M", url: "https://buva.io" }],
	openGraph: {
		title: "Bhuvaneshwaran M | Buva.io",
		description: "I'm Bhuvaneshwaran, Science, Technology and Art enthusiast,  this is where I share my work, progress and my passion projects. You'll find a diverse collection of content, including breakdowns 3D art, interactive 3D simulations, and wide rage of web projects. Beyond the technical, I also share personal stories and insights from my ongoing journey as a developer and creator. Whether you're here for the code, the art, or the story, I hope you find something that inspires you.",
		url: "https://buva.io",
		siteName: "Bhuvaneshwaran M | Buva.io",
		images: [
			{
				url: "https://cdn.jsdelivr.net/gh/felix-ops/website-assets/logos/bu-logo.svg",
				width: 420,
				height: 420,
				alt: "buva's logo",
			},
		],
		locale: "en_US",
		type: "website",
	},

	icons: {
		icon: "/logos/bu-logo.svg",
	},

	robots: {
		index: true,
		follow: true,
	},

	keywords: [
		"3D",
		"Visualization",
		"3D Visualization",
		"Simulation",
		"Portfolio",
		"Blog",
		"Bhuvaneshwaran",
		"Blender",
		"WebGL",
		"Babylon.js",
		"Three.js",
		"Embedded Systems",
		"IoT",
		"Ground Station",
		"Satellite",
		"Nano Satellite",
		"AzaadiSAT-2",
		"Space Kidz India",
		"Monkey Science",
		"3D Simulations",
		"EdTech",
		"3D Experiences",
		"Immersive Technology",
	],
};
