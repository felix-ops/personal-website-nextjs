import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
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
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
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
		"I'm Bhuvanesh, a Science, Technology, and Art enthusiast sharing my projects and creative journey. Here you'll find 3D graphic projects, interactive sims, web experiments, and personal insights.",
	authors: [{ name: "Bhuvaneshwaran M", url: baseURL }],
	openGraph: {
		title: "Bhuvaneshwaran M - Buva.io",
		description:
			"I'm Bhuvanesh, a Science, Technology, and Art enthusiast sharing my projects and creative journey. Here you'll find 3D graphic projects, interactive sims, web experiments, and personal insights.",
		url: baseURL,
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
