const TAGS = ["Blogs", "Projects", "Research", "Life", "Simulation", "Playground"] as const;

export type tag = (typeof TAGS)[number];

export const tagValues: tag[] = [...TAGS];

export type Post = {
	id: string;
	title: string;
	description: string;
	image: string;
	link: string;
	tags: tag[];
	date: string;
};
