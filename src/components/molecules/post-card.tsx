import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/data/posts-data";

interface PostCardProps {
	post: Post;
}

export function PostCard({ post }: PostCardProps) {
	return (
		<Link
			href={post.link}
			className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
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
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
				<div className="absolute top-4 right-4">
					<Badge className={`${post.categoryColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
						{post.tags[0]}
					</Badge>
				</div>
				<div className="absolute top-4 left-4">
					<Badge variant="secondary" className="bg-white/90 text-slate-700 px-2 py-1 rounded text-xs">
						{post.date}
					</Badge>
				</div>
			</div>
			<div className="p-6">
				<h3 className="font-semibold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
					{post.title}
				</h3>
				<p className="text-slate-600 text-sm mb-4 leading-relaxed">{post.description}</p>
				<div className="flex flex-wrap gap-2 mb-4">
					{post.tags.map((tag, tagIndex) => (
						<Badge
							key={`${post.id}-${tag}-${tagIndex}`}
							variant="secondary"
							className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"
						>
							{tag}
						</Badge>
					))}
				</div>
				<div className="flex items-center justify-between">
					<Button variant="ghost" className="text-primary hover:text-blue-700 font-medium text-sm p-0 h-auto">
						View Details <ArrowRight className="ml-1 h-3 w-3" />
					</Button>
				</div>
			</div>
		</Link>
	);
}
