import fs from "fs";
import path from "path";
import Footer from "@/components/organisms/footer";
import Navigation from "@/components/organisms/navbar";
import { notFound } from "next/navigation";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

const postsDirectory = path.join(process.cwd(), "src/app/blogs/content");

export async function generateStaticParams() {
	const files = fs.readdirSync(postsDirectory);
	return files.map((file) => ({
		slug: file.replace(/\.md$/, ""),
	}));
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const filePath = path.join(postsDirectory, `${slug}.md`);

	let fileContent;
	try {
		fileContent = fs.readFileSync(filePath, "utf8");
	} catch {
		notFound(); // Show 404 if blog doesn't exist
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col">
			<Navigation />
			<div className="markdown-body flex-1 flex items-center justify-center py-20 ">
				<article className="prose prose-slate lg:prose-lg bg-white/90 rounded-2xl shadow-md p-16 w-full max-w-5xl border border-slate-200">
					<h1 className="text-4xl font-bold mb-6 text-center text-slate-900">{slug.replace(/-/g, " ")}</h1>
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeRaw, [rehypeHighlight, { ignoreMissing: true }], rehypeSlug]}
					>
						{fileContent}
					</ReactMarkdown>
				</article>
			</div>
			<Footer />
		</div>
	);
}
