import type { Metadata } from "next";
import { posts } from "@/data/posts-data";

function deriveSlugFromModuleUrl(moduleUrl: string): string {
	try {
		const dir = new URL(".", moduleUrl).pathname || ""; // parent directory of layout.tsx
		const normalized = dir.replace(/\\/g, "/");
		const segments = normalized.split("/").filter(Boolean);
		return segments[segments.length - 1] ?? "";
	} catch {
		return "";
	}
}

function normalizePathLike(input: unknown): string {
	if (typeof input !== "string") return "";
	try {
		const lower = input.toLowerCase();
		if (lower.startsWith("http://") || lower.startsWith("https://")) {
			const url = new URL(lower);
			return url.pathname.replace(/\/$/, "");
		}
		return lower.replace(/\/$/, "");
	} catch {
		return "";
	}
}

export async function generateProjectMetadata(moduleUrl: string): Promise<Metadata> {
	const slug = deriveSlugFromModuleUrl(moduleUrl).toLowerCase();

	const expectedPath = slug ? `/projects/${slug}` : "";
	const project = posts.find((p) => {
		if (!Array.isArray(p.tags) || !p.tags.includes("Projects")) return false;
		const linkPath = normalizePathLike(p.link);
		const id = typeof p.id === "string" ? p.id.toLowerCase() : "";
		if (!slug) return linkPath.startsWith("/projects/");
		return id === slug || linkPath === expectedPath || linkPath.endsWith(`/${slug}`);
	});

	const title = project?.title ?? "Project";
	const description = project?.description ?? "Explore a project on Buva.io.";

	const canonicalPath =
		(typeof project?.link === "string" && project.link) || (slug ? `/projects/${slug}` : "/projects");

	return {
		title,
		description,
		alternates: {
			canonical: `https://buva.io${canonicalPath}`,
		},
		openGraph: {
			title,
			description,
			url: `https://buva.io${canonicalPath}`,
			siteName: "Buva.io",
			type: "website",
		},
	};
}
