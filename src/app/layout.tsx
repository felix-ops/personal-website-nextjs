import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/atoms/toaster";
import { personalInfo } from "@/data/information";

export const metadata: Metadata = {
	metadataBase: new URL("http://localhost:3000"),
	title: personalInfo.fullName,
	description: "Portfolio and blog of Bhuvaneshwaran M, 3D visualization and simulation expert.",
	keywords: ["3D", "Visualization", "Simulation", "Portfolio", "Blog", "Bhuvaneshwaran"],
	authors: [{ name: "Bhuvaneshwaran M", url: "https://github.com/felix-ops/" }],
	openGraph: {
		title: "Bhuvanesh | Portfolio",
		description: "Portfolio and blog of Bhuvaneshwaran M, 3D visualization and simulation expert.",
		url: "http://localhost:3000",
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
