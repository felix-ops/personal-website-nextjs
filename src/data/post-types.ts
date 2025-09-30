const TAGS = ["Blogs", "Projects", "Research", "3D", "Life", "Simulation", "Playground", "Japanese"] as const;

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
	isHidden?: boolean;
};
