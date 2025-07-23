import Footer from "@/components/organisms/footer";
import Navigation from "@/components/organisms/navbar";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import rehypeRaw from "rehype-raw";

export default async function BlogPage({ params }: { params: { slug: string } }) {
	const { slug } = params;
	const filePath = path.join(process.cwd(), "src/app/blogs/content", `${slug}.md`);

	let fileContent;
	try {
		fileContent = fs.readFileSync(filePath, "utf8");
	} catch {
		notFound(); // Show 404 if blog doesn't exist
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col">
			<Navigation />
			<div className="flex-1 flex items-center justify-center py-20 px-2">
				<article className="prose prose-slate lg:prose-lg bg-white/90 rounded-2xl shadow-md p-8 w-full max-w-5xl border border-slate-200">
					<h1 className="text-4xl font-bold mb-6 text-center text-slate-900">{slug.replace(/-/g, " ")}</h1>
					<ReactMarkdown rehypePlugins={[rehypeRaw]}>{fileContent}</ReactMarkdown>
				</article>
			</div>
			<Footer />
		</div>
	);
}
