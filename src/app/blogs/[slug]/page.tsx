import fs from "fs";
import path from "path";
import Footer from "@/components/organisms/footer";
import Navigation from "@/components/organisms/navbar";
import { notFound } from "next/navigation";

import MarkdownRenderer from "@/components/organisms/markdown-renderer";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import { stories } from "@/data/stories-data";
import { format } from "date-fns";

const postsDirectory = path.join(process.cwd(), "src/app/blogs/content");

export async function generateStaticParams() {
	const files = fs.readdirSync(postsDirectory);
	return files.map((file) => ({
		slug: file.replace(/\.md$/, ""),
	}));
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const id = slug;
	const filePath = path.join(postsDirectory, `${id}.md`);

	let fileContent;
	try {
		fileContent = fs.readFileSync(filePath, "utf8");
	} catch {
		notFound(); // Show 404 if blog doesn't exist
	}

	const story = stories.find((s) => s.id === id)!;

	// Try to parse the date for formatting, fallback to raw if not possible
	let formattedDate = story.date;
	try {
		// Accepts YYYY or YYYY-MM-DD
		const dateObj = story.date.length === 4 ? new Date(story.date) : new Date(story.date);
		if (!isNaN(dateObj.getTime())) {
			formattedDate = format(dateObj, "EEE, MMM d, yyyy");
		}
	} catch {}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col">
			<Navigation />
			<div className="flex-1 flex items-center justify-center py-20">
				<article className="markdown-body bg-white/90 rounded-2xl shadow-md p-16 pt-7 w-full max-w-4xl border border-slate-200">
					<div className="mb-4 text-left">
						<h1 className="text-5xl font-extrabold text-slate-900 leading-tight">{story.title}</h1>
						<p className="text-base text-slate-700 mb-6 whitespace-pre-line">{story.description}</p>
						<div className="flex flex-wrap items-center gap-0 text-slate-500 text-sm">
							<span>{formattedDate}</span>
							{story.tags.length > 0 && <span className="mx-1">·</span>}
							{story.tags.map((tag, i) => (
								<span
									key={tag}
									className="font-semibold text-slate-700 hover:text-slate-400 transition-colors duration-400 cursor-pointer rounded  py-1"
								>
									{tag}
									{i < story.tags.length - 1 && <span className="mx-1">·</span>}
								</span>
							))}
						</div>
					</div>
					<div className="border-b border-slate-200 mb-8 border-t-2" />
					<MarkdownRenderer content={fileContent} />
				</article>
			</div>
			<Footer />
		</div>
	);
}
