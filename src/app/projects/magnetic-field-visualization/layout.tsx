import type { Metadata } from "next";
import { generateProjectMetadata } from "../../../lib/projectLayoutMetadata";

export default function ProjectSlugLayout({ children }: { children: React.ReactNode }) {
	return children;
}

export async function generateMetadata(): Promise<Metadata> {
	return generateProjectMetadata(import.meta.url);
}
