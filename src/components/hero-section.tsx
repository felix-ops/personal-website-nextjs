import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            3D Artist & Simulation Developer
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Creating immersive 3D experiences and complex simulations that bridge the gap between imagination and reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("#projects")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("#contact")}
              className="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
