export type Story = {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
    category: string;
    categoryColor: string;
    tags: string[];
    year: string;
  };
  
  export const storyCategories = [
    "all",
    "3D Visualization",
    "Simulation",
    "Character Design",
    "Product Design",
    "VR Experience",
    "Animation",
  ];

  export const stories: Story[] = [
    {
        id: 1,
        title: "Modern Office Complex",
        description:
            "Photorealistic architectural visualization featuring advanced lighting, materials, and environmental details for a commercial development project.",
        image:
            "https://pixabay.com/get/g9511300b498bbd56140e1f3a913f51e12a35cc173b5260dd209328834b6cb645f8e3bbc9681b78c57ecf7feb4d00cdd1370159b38c466db7e6337e8cec202f4f_1280.jpg",
        link: "https://en.wikipedia.org/wiki/Main_Page",
        category: "3D Visualization",
        categoryColor: "bg-blue-600",
        tags: ["Blender", "V-Ray", "Photoshop"],
        year: "2025",
    },
    {
        id: 2,
        title: "Fluid Dynamics Simulator",
        description:
            "Real-time fluid simulation with particle systems, featuring interactive controls and customizable physics parameters for educational applications.",
        image:
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        link: "https://en.wikipedia.org/wiki/Main_Page",
        category: "Simulation",
        categoryColor: "bg-green-600",
        tags: ["Unity", "C#", "HLSL"],
        year: "2025",
    },
    {
        id: 3,
        title: "Fantasy Character Suite",
        description:
            "Complete character pipeline including modeling, rigging, and animation for a fantasy game project with detailed textures and expressions.",
        image:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        link: "https://en.wikipedia.org/wiki/Main_Page",
        category: "Character Design",
        categoryColor: "bg-purple-600",
        tags: ["ZBrush", "Maya", "Substance"],
        year: "2025",
    },
    {
        id: 4,
        title: "Smart Device Showcase",
        description:
            "High-end product visualization for consumer electronics, featuring studio lighting setups and material accuracy for marketing campaigns.",
        image:
            "https://pixabay.com/get/gf94c2e5e670ca81d74e460b0032bfdf880d100a0dd2a81ee9ab0d80dd0668d2c546d062eb3201c121ba9597d81ef8fecf4d4a823472405e2b44d9da18448304f_1280.jpg",
        link: "https://en.wikipedia.org/wiki/Main_Page",
        category: "Product Design",
        categoryColor: "bg-orange-600",
        tags: ["KeyShot", "Rhino", "After Effects"],
        year: "2025",
    },
    {
        id: 5,
        title: "Immersive VR Training",
        description:
            "Virtual reality training environment for industrial applications, featuring interactive elements and realistic physics simulations.",
        image:
            "https://pixabay.com/get/ge92c6f7c8412597f47d33b29bd3e0ef0e0f6e93fd71283cdc794a25892dd860eededa316ca2d4423250327444734ec13cfda65bcf6650707b862cd41d8b2568f_1280.jpg",
        link: "https://en.wikipedia.org/wiki/Main_Page",
        category: "VR Experience",
        categoryColor: "bg-indigo-600",
        tags: ["Unreal Engine", "OpenXR", "Blueprint"],
        year: "2025",
    },
    {
        id: 6,
        title: "Mechanical Assembly",
        description:
            "Technical animation demonstrating complex mechanical systems and assembly processes for manufacturing documentation.",
        image:
            "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
            link: "/stories",
        category: "Animation",
        categoryColor: "bg-red-600",
        tags: ["SolidWorks", "Blender", "Premiere Pro"],
        year: "2025",
    },
  ];
  
