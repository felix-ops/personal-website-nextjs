import fs from "fs";
import path from "path";
import Footer from "@/components/organisms/footer";
import Navigation from "@/components/organisms/navbar";
import { notFound } from "next/navigation";

import MarkdownRenderer from "@/components/organisms/markdown-renderer";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import { posts } from "@/data/posts-data";
import Link from "next/link";

const postsDirectory = path.join(process.cwd(), "src/app/blogs/content");

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

	const post = posts.find((s) => s.id === id)!;

	return (
		<div className="min-h-screen bg-color1 flex flex-col">
			<Navigation />
			<div className="flex-1 flex items-center justify-center py-10 md:py-20">
				<article className="markdown-body !bg-color7 rounded-2xl w-full max-w-4xl border border-white/0 md:border-slate-200 md:shadow-md p-6 md:p-16 md:pt-7">
					<div className="mb-4 text-left">
						<h1 className="text-5xl leading-tight">{post.title}</h1>
						<p className="text-base text-color4 mb-6 whitespace-pre-line">{post.description}</p>
						<div className="flex flex-wrap items-center gap-0 text-color4 text-sm">
							<span>{post.date}</span>
							{post.tags.length > 0 && <span className="mx-1">·</span>}
							{post.tags.map((tag, i) => (
								<Link
									key={tag}
									href={`/posts/${tag.toLowerCase()}`}
									className="font-semibold !text-color4 hover:!text-color8 transition-colors duration-300 cursor-pointer rounded py-1 !no-underline"
								>
									{tag}
									{i < post.tags.length - 1 && <span className="mx-1">·</span>}
								</Link>
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
