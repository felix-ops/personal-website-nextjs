"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/molecules/code-block";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

export default function MarkdownRenderer({ content }: { content: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeRaw, [rehypeHighlight, { ignoreMissing: true }], rehypeSlug]}
			components={{
				// Only customize 'pre' for code blocks
				pre({ children, ...props }) {
					return <CodeBlock {...props}>{children}</CodeBlock>;
				},
				// Always render <code> for inline code
				code(props) {
					return <code {...props}>{props.children}</code>;
				},
			}}
		>
			{content}
		</ReactMarkdown>
	);
}
