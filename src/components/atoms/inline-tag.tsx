"use client";

import { tag } from "@/data/post-types";
import { useRouter } from "next/navigation";

interface InlineTagProps {
	tag: tag;
	onClick?: () => void;
}

export function InlineTag({ tag, onClick }: InlineTagProps) {
	const router = useRouter();

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (onClick) {
			onClick();
		} else {
			// Navigate to the posts page with the tag as a parameter
			router.push(`/posts/${tag.toLowerCase()}`);
		}
	};

	return (
		<span
			className="inline-block bg-color6 text-color3 px-2 py-1 rounded-[0.4rem] text-xs hover:bg-slate-200 transition-colors cursor-pointer font-semibold"
			onClick={handleClick}
		>
			{tag}
		</span>
	);
}
