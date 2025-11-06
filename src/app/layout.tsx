import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/atoms/toaster";
import { baseURL } from "@/data/information";

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
		default: "Bhuvaneshwaran M - Buva.io",
		template: "%s - Buva.io",
	},
	metadataBase: new URL(baseURL),
	description:
		"I'm Bhuvaneshwaran, a Science, Technology, and Art enthusiast sharing my projects and creative journey. Here you'll find 3D art breakdowns, interactive simulations, web experiments, and personal insights from my path as a developer and creator.",
	authors: [{ name: "Bhuvaneshwaran M", url: "https://buva.io" }],
	openGraph: {
		title: "Bhuvaneshwaran M - Buva.io",
		description:
			"I'm Bhuvaneshwaran, a Science, Technology, and Art enthusiast sharing my projects and creative journey. Here you'll find 3D art breakdowns, interactive simulations, web experiments, and personal insights from my path as a developer and creator.",
		url: "https://buva.io",
		siteName: "Bhuvaneshwaran M - Buva.io",
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
