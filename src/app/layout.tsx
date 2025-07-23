import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/atoms/toaster";

export const metadata: Metadata = {
	title: "Bhuvanesh",
	description: "Personal Website",
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
