"use client";
import { useState, type ReactNode } from "react";

export default function CodeBlock({ className, children, ...props }: { className?: string; children?: ReactNode }) {
	const [copied, setCopied] = useState(false);
	const code = String(children).replace(/\n$/, "");

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 1200);
		} finally {
			// No-op
		}
	};

	return (
		<pre className={`relative group ${className || ""}`} {...props}>
			<button
				type="button"
				aria-label="Copy code"
				onClick={handleCopy}
				className="absolute top-2 right-2 px-3 py-1 rounded bg-[#e8eef1] hover:bg-[#e0e0e0] border border-slate-200 cursor-pointer transition group text-xs font-medium"
				tabIndex={0}
			>
				{copied ? "Copied!" : "Copy"}
			</button>
			<code>{children}</code>
		</pre>
	);
}
