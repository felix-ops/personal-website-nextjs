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
	title: "buva.io | Bhuvaneshwaran M",
	metadataBase: new URL("https://buva.io"),
	description: "A creative space where I'll share my insights and experiences from my journey.",
	authors: [{ name: "Bhuvaneshwaran M", url: "https://buva.io" }],
	openGraph: {
		title: "Buva's Journal",
		description: "A creative space where I'll share my insights and experiences from my journey.",
		url: "https://buva.io",
		siteName: "Buva's Journal",
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
