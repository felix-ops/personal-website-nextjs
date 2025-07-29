const TAGS = ["Blogs", "Projects", "Research", "Life", "Simulation"] as const;

export type tag = (typeof TAGS)[number];

export const tagValues: tag[] = [...TAGS];
