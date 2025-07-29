import { tag } from "./tag";

export const posts: Post[] = [
	{
		id: "test-blog-2",
		title: "3D Magnetic Field Simulation",
		description:
			"Building 3d simulation of a monkey in Unity, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		image: "/images/ski-group-photo.jpg",
		link: "/blogs/test-blog-2",
		categoryColor: "bg-blue-600",
		tags: ["Blogs", "Projects", "Life", "Simulation", "Research"],
		date: "22-Apr-2025",
	},
	{
		id: "test-blog-1",
		title: "Test Blog",
		description: "Space Kids India Project Development",
		image: "/images/ski-group-photo.jpg",
		link: "/blogs/test-blog-1",
		categoryColor: "bg-blue-600",
		tags: ["Blogs"],
		date: "2025",
	},
	{
		id: "6",
		title: "Modern Office Complex",
		description:
			"Photorealistic architectural visualization featuring advanced lighting, materials, and environmental details for a commercial development project.",
		image: "https://cdn.pixabay.com/photo/2023/02/15/10/19/backlinks-7791387_1280.jpg",
		link: "https://en.wikipedia.org/wiki/Main_Page",
		categoryColor: "bg-blue-600",
		tags: ["Projects"],
		date: "2025",
	},
	{
		id: "5",
		title: "Fluid Dynamics Simulator",
		description:
			"Real-time fluid simulation with particle systems, featuring interactive controls and customizable physics parameters for educational applications.",
		image:
			"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
		link: "https://en.wikipedia.org/wiki/Main_Page",
		categoryColor: "bg-green-600",
		tags: ["Projects", "Simulation"],
		date: "2025",
	},
	{
		id: "4",
		title: "Fantasy Character Suite",
		description:
			"Complete character pipeline including modeling, rigging, and animation for a fantasy game project with detailed textures and expressions.",
		image:
			"https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
		link: "https://en.wikipedia.org/wiki/Main_Page",
		categoryColor: "bg-purple-600",
		tags: ["Simulation", "Projects"],
		date: "2025",
	},
	{
		id: "3",
		title: "Smart Device Showcase",
		description:
			"High-end product visualization for consumer electronics, featuring studio lighting setups and material accuracy for marketing campaigns.",
		image: "https://cdn.pixabay.com/photo/2023/02/15/10/22/backlinks-7791414_1280.jpg",
		link: "https://en.wikipedia.org/wiki/Main_Page",
		categoryColor: "bg-orange-600",
		tags: ["Projects"],
		date: "2025",
	},
	{
		id: "2",
		title: "Immersive VR Training",
		description:
			"Virtual reality training environment for industrial applications, featuring interactive elements and realistic physics simulations.",
		image: "https://cdn.pixabay.com/photo/2017/08/08/22/11/century-link-field-2612912_1280.jpg",
		link: "https://en.wikipedia.org/wiki/Main_Page",
		categoryColor: "bg-indigo-600",
		tags: ["Projects"],
		date: "2025",
	},
	{
		id: "1",
		title: "Mechanical Assembly",
		description:
			"Technical animation demonstrating complex mechanical systems and assembly processes for manufacturing documentation.",
		image:
			"https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
		link: "/posts",
		categoryColor: "bg-red-600",
		tags: ["Projects"],
		date: "2025",
	},
];

export type Post = {
	id: string;
	title: string;
	description: string;
	image: string;
	link: string;
	categoryColor: string;
	tags: tag[];
	date: string;
};
