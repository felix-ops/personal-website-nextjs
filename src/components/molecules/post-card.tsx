import Link from "next/link";
import Image from "next/image";
import { Post } from "@/data/posts-data";
import { format } from "date-fns";

interface PostCardProps {
	post: Post;
}

export function PostCard({ post }: PostCardProps) {
	return (
		<Link
			href={post.link}
			className="group bg-color1 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-98"
		>
			<div className="relative overflow-hidden">
				<div className="relative w-full h-48">
					<Image
						src={post.image}
						alt={post.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
				</div>
			</div>
			<div className="p-5 pt-4 flex flex-col h-1/2">
				<h3 className="font-semibold text-lg text-color3 mb-2 transition-colors duration-200">{post.title}</h3>
				<p className="text-color4 text-sm mb-4 leading-relaxed line-clamp-3">{post.description}</p>
				<div className="flex-1" />
				<div className="flex items-center justify-between w-full mt-2">
					<div className="flex flex-wrap gap-2">
						{post.tags.map((tag, tagIndex) => (
							<span
								key={`${post.id}-${tag}-${tagIndex}`}
								className="inline-block bg-color6 text-color3 px-2 py-1 rounded-[0.4rem] text-xs hover:bg-slate-200 transition-colors cursor-pointer font-semibold"
							>
								{tag}
							</span>
						))}
					</div>
					<span className="text-xs text-color4 font-medium">
						{(() => {
							try {
								const dateObj = post.date.length === 4 ? new Date(post.date) : new Date(post.date);
								if (!isNaN(dateObj.getTime())) {
									return format(dateObj, "EEE, MMM d, yyyy");
								}
							} catch {}
							return post.date;
						})()}
					</span>
				</div>
			</div>
		</Link>
	);
}
