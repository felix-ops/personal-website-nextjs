import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/atoms/toaster";

export const metadata: Metadata = {
	title: "Bhuvanesh",
	description: "Portfolio and blog of Bhuvaneshwaran M, 3D visualization and simulation expert.",
	keywords: ["3D", "Visualization", "Simulation", "Portfolio", "Blog", "Bhuvaneshwaran"],
	authors: [{ name: "Bhuvaneshwaran M", url: "https://yourdomain.com" }],
	openGraph: {
		title: "Bhuvanesh | Portfolio",
		description: "Portfolio and blog of Bhuvaneshwaran M, 3D visualization and simulation expert.",
		url: "https://yourdomain.com",
		siteName: "Bhuvanesh Portfolio",
		images: [
			{
				url: "/logos/ski-logo.svg", // or a full URL
				width: 800,
				height: 600,
				alt: "Bhuvanesh Portfolio Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},

	icons: {
		icon: "/logos/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<QueryProvider>
					{children}
					<Toaster />
				</QueryProvider>
			</body>
		</html>
	);
}
