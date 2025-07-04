"use client";

import Navigation from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, Filter, ArrowRight, Heart } from "lucide-react";

export default function ProjectsPage() {
    const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
  
    const toggleLike = (projectId: number) => {
      const newLikedProjects = new Set(likedProjects);
      if (newLikedProjects.has(projectId)) {
        newLikedProjects.delete(projectId);
      } else {
        newLikedProjects.add(projectId);
      }
      setLikedProjects(newLikedProjects);
    };
  
    const allProjects = [
      {
        id: 1,
        title: "Modern Office Complex",
        description: "Photorealistic architectural visualization featuring advanced lighting, materials, and environmental details for a commercial development project.",
        image: "https://pixabay.com/get/g9511300b498bbd56140e1f3a913f51e12a35cc173b5260dd209328834b6cb645f8e3bbc9681b78c57ecf7feb4d00cdd1370159b38c466db7e6337e8cec202f4f_1280.jpg",
        category: "3D Visualization",
        categoryColor: "bg-blue-600",
        tools: ["Blender", "V-Ray", "Photoshop"],
        year: "2024"
      },
      {
        id: 2,
        title: "Fluid Dynamics Simulator",
        description: "Real-time fluid simulation with particle systems, featuring interactive controls and customizable physics parameters for educational applications.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Simulation",
        categoryColor: "bg-green-600",
        tools: ["Unity", "C#", "HLSL"],
        year: "2024"
      },
      {
        id: 3,
        title: "Fantasy Character Suite",
        description: "Complete character pipeline including modeling, rigging, and animation for a fantasy game project with detailed textures and expressions.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Character Design",
        categoryColor: "bg-purple-600",
        tools: ["ZBrush", "Maya", "Substance"],
        year: "2023"
      },
      {
        id: 4,
        title: "Smart Device Showcase",
        description: "High-end product visualization for consumer electronics, featuring studio lighting setups and material accuracy for marketing campaigns.",
        image: "https://pixabay.com/get/gf94c2e5e670ca81d74e460b0032bfdf880d100a0dd2a81ee9ab0d80dd0668d2c546d062eb3201c121ba9597d81ef8fecf4d4a823472405e2b44d9da18448304f_1280.jpg",
        category: "Product Design",
        categoryColor: "bg-orange-600",
        tools: ["KeyShot", "Rhino", "After Effects"],
        year: "2023"
      },
      {
        id: 5,
        title: "Immersive VR Training",
        description: "Virtual reality training environment for industrial applications, featuring interactive elements and realistic physics simulations.",
        image: "https://pixabay.com/get/ge92c6f7c8412597f47d33b29bd3e0ef0e0f6e93fd71283cdc794a25892dd860eededa316ca2d4423250327444734ec13cfda65bcf6650707b862cd41d8b2568f_1280.jpg",
        category: "VR Experience",
        categoryColor: "bg-indigo-600",
        tools: ["Unreal Engine", "OpenXR", "Blueprint"],
        year: "2023"
      },
      {
        id: 6,
        title: "Mechanical Assembly",
        description: "Technical animation demonstrating complex mechanical systems and assembly processes for manufacturing documentation.",
        image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Animation",
        categoryColor: "bg-red-600",
        tools: ["SolidWorks", "Blender", "Premiere Pro"],
        year: "2022"
      },
      {
        id: 7,
        title: "Luxury Interior Design",
        description: "High-end interior visualization for luxury residential project, featuring custom furniture, advanced materials, and atmospheric lighting.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "3D Visualization",
        categoryColor: "bg-blue-600",
        tools: ["3ds Max", "Corona", "Photoshop"],
        year: "2022"
      },
      {
        id: 8,
        title: "Interactive Science Museum",
        description: "Interactive 3D exhibits for science museum, featuring touch-responsive displays and educational content for various age groups.",
        image: "https://images.unsplash.com/photo-1567166771894-f1b9c0be8e65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "VR Experience",
        categoryColor: "bg-indigo-600",
        tools: ["Unity", "Oculus SDK", "C#"],
        year: "2022"
      },
      {
        id: 9,
        title: "Automotive Product Launch",
        description: "Cinematic car visualization for product launch campaign, featuring dynamic lighting, realistic materials, and motion graphics.",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Product Design",
        categoryColor: "bg-orange-600",
        tools: ["Cinema 4D", "Octane", "After Effects"],
        year: "2021"
      }
    ];
  
    const categories = ["all", "3D Visualization", "Simulation", "Character Design", "Product Design", "VR Experience", "Animation"];
  
    const filteredProjects = allProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        
        {/* Header */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                All Projects
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Explore my complete portfolio of 3D visualizations, simulations, and creative projects.
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-slate-400 h-4 w-4" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-slate-500 text-lg">No projects found matching your criteria.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <p className="text-slate-600">
                      Showing {filteredProjects.length} of {allProjects.length} projects
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                      >
                        <div className="relative overflow-hidden">
                          <img 
                            src={project.image}
                            alt={project.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                          <div className="absolute top-4 right-4">
                            <Badge className={`${project.categoryColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                              {project.category}
                            </Badge>
                          </div>
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-white/90 text-slate-700 px-2 py-1 rounded text-xs">
                              {project.year}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                            {project.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tools.map((tool, toolIndex) => (
                              <Badge key={toolIndex} variant="secondary" className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <Button
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm p-0 h-auto"
                            >
                              View Details <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLike(project.id)}
                              className={`p-1 h-auto ${likedProjects.has(project.id) ? 'text-red-500' : 'text-slate-400 hover:text-slate-600'} transition-colors duration-200`}
                            >
                              <Heart className={`h-4 w-4 ${likedProjects.has(project.id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-slate-400">
                © 2024 John Doe. All rights reserved. | Crafted with passion for 3D art and innovation.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
