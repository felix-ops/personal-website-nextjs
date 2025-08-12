import { formatPosts } from "@/lib/utils";
import { Post } from "./post-types";

//If it is a blog the ID and the link ending should be identical
const rawPosts: Post[] = [
	{
		id: "0002-grind-kanji-grind",
		title: "Kanji Grind Quiz",
		description: `A Web application built to help memorize and recognize kanji by quiz method.`,
		image: "https://cdn.jsdelivr.net/gh/felix-ops/website-assets/thumbnails/gkg-screenshot2-desktop-ii34rv.png",
		link: "https://kanjigrind.netlify.app",
		tags: ["Projects", "Japanese"],
		date: "26-May-2024",
	},
	{
		id: "0001-magnetic-field-vis",
		title: "Magnetic Field Visualization",
		description: `Interactive visualization of Electro Magnetic field lines created with GLSL shaders and Babylon js.`,
		image: "https://cdn.jsdelivr.net/gh/felix-ops/website-assets/solenoid.png",
		link: "/projects/004-magnetic-field-visualization",
		tags: ["Projects", "3D"],
		date: "12-Aug-2025",
	},
	{
		id: "azaadi-sat-2-vis-24scO",
		title: "Azaadi Sat - 2 Visualization",
		description: `This visualization presents the AzaadiSat-2 satellite with a 1:1 scale representation of its expandable solar panel deployment in orbit.`,
		image: "https://cdn.jsdelivr.net/gh/felix-ops/website-assets/azaadi-sat-vis.jpg",
		link: "https://www.artstation.com/artwork/1xnrWX",
		tags: ["Projects", "3D"],
		date: "16-Feb-2023",
	},
	{
		id: "librarian-3d-model-DfKjk",
		title: "Librarian 3D Model",
		description: `This is my first 3D character model, built completely in blender, inspired from the 2D concept art created by Shen YH.`,
		image: "https://cdn.jsdelivr.net/gh/felix-ops/website-assets/book-girl.png",
		link: "https://www.artstation.com/artwork/DAR8ee",
		tags: ["Projects", "3D"],
		date: "2-Oct-2022",
	},
	{
		id: "quiet-girl-a3rt4",
		title: "Quiet Girl 3D Model",
		description: `3D Rendering inspired by Leonardo Mazzoli's "Quiet Girl" artwork`,
		image: "https://cdn.jsdelivr.net/gh/felix-ops/website-assets/quite-girl-landscape.png",
		link: "https://www.artstation.com/artwork/qe5BDz",
		tags: ["Projects", "3D"],
		date: "16-Dec-2023",
	},
	{
		id: "test-blog-2-4tegy",
		title: "Blog Testing Page",
		description:
			"Building 3d simulation of a monkey in Unity, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		image: "https://cdn.jsdelivr.net/gh/felix-ops/website-assets/ski-group-photo.jpg",
		link: "/blogs/test-blog-2-4tegy",
		tags: ["Blogs", "Projects", "Life", "Simulation", "Research"],
		date: "22-Apr-2025",
	},
	{
		id: "0000-wave-shader-image",
		title: "Wave Shader Image Demo",
		description: "Demo of a webgl shader that creates a wave effect on an image.",
		image: "https://cdn.jsdelivr.net/gh/felix-ops/website-assets/skeleton.png",
		link: "/projects/002-shaders-image-demo",
		tags: ["Playground"],
		date: "30-Jul-2025",
	},
];

export const posts = formatPosts(rawPosts);
