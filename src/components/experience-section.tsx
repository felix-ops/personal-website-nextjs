import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ExperienceSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const experiences = [
    {
      title: "Senior 3D Artist",
      company: "TechVision Studios",
      period: "2022 - Present",
      description: "Leading a team of 3D artists in creating high-quality architectural visualizations and product renders for major clients. Specialized in photorealistic rendering and complex lighting setups. Managing multiple projects simultaneously while maintaining quality standards and meeting tight deadlines.",
      backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600",
      tags: ["Team Leadership", "Architectural Viz", "Product Rendering", "Client Management"],
      icon: "fas fa-cube",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Simulation Developer",
      company: "SimuLab Technologies",
      period: "2020 - 2022",
      description: "Developed interactive physics simulations and educational tools using Unity 3D. Created real-time fluid dynamics and particle systems for scientific visualization projects. Collaborated with researchers to translate complex scientific concepts into accessible interactive experiences.",
      backgroundImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600",
      tags: ["Unity 3D", "Physics Simulation", "Educational Tools", "Scientific Visualization"],
      icon: "fas fa-rocket",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "3D Artist",
      company: "Creative Dynamics",
      period: "2018 - 2020",
      description: "Created 3D models, textures, and animations for gaming and marketing projects. Gained expertise in character modeling, environment design, and optimized asset creation. Worked closely with art directors to achieve desired visual styles and technical requirements.",
      backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600",
      tags: ["Character Modeling", "Environment Design", "Game Assets", "Animation"],
      icon: "fas fa-paint-brush",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Freelance 3D Artist",
      company: "Independent",
      period: "2017 - 2018",
      description: "Started my professional journey creating 3D models and animations for small businesses and startups. Developed skills in client communication and project management. Built a strong foundation in various 3D software and workflows while establishing professional relationships.",
      backgroundImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600",
      tags: ["Client Relations", "Project Management", "3D Modeling", "Animation"],
      icon: "fas fa-graduation-cap",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? experiences.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === experiences.length - 1 ? 0 : prev + 1));
  };

  const currentExperience = experiences[currentIndex];

  return (
    <section id="experience" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Experience</h2>
            <p className="text-lg text-slate-600">
              A journey through my professional growth and key achievements.
            </p>
          </div>

          {/* Experience Display with Background */}
          <div className="relative rounded-2xl shadow-lg overflow-hidden min-h-[500px]">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentExperience.backgroundImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
            </div>

            {/* Navigation Controls - Top Right */}
            <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="text-white hover:text-blue-300 hover:bg-white/20 font-medium"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="text-white text-sm">|</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="text-white hover:text-blue-300 hover:bg-white/20 font-medium"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Company Icon */}
            <div className="absolute top-6 left-6 z-10">
              <div className={`w-16 h-16 ${currentExperience.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                <i className={`${currentExperience.icon} ${currentExperience.iconColor} text-2xl`}></i>
              </div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-8 md:p-12 min-h-[500px] flex flex-col justify-between">
              {/* Top Section - Title and Company */}
              <div className="flex justify-between items-start">
                <div className="max-w-2xl">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {currentExperience.company}
                  </h3>
                  <p className="text-xl md:text-2xl text-blue-300 font-semibold mb-2">
                    {currentExperience.title}
                  </p>
                  <p className="text-white/80 font-medium text-lg">
                    {currentExperience.period}
                  </p>
                </div>
              </div>

              {/* Bottom Section - Description and Tags */}
              <div className="space-y-6">
                <p className="text-white/90 leading-relaxed text-lg max-w-4xl">
                  {currentExperience.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {currentExperience.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      className="bg-blue-600/80 text-white px-3 py-1 rounded-full border border-blue-400/50 hover:bg-blue-500/80 transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Page Indicators - Bottom Center */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex space-x-3">
                {experiences.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
