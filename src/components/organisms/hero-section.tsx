import { ScrollButton } from "../molecules/scroll-button";

export default function HeroSection() {
	return (
		<section className="pt-55 pb-45 bg-gradient-to-br from-slate-50 to-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center animate-fade-in">
					<h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">3D Artist & Simulation Developer</h1>
					<p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
						Creating immersive 3D experiences and complex simulations that bridge the gap between imagination and
						reality.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<ScrollButton
							target="#stories"
							className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors duration-200 cursor-pointer"
						>
							View My Work
						</ScrollButton>
						<ScrollButton
							target="#contact"
							variant="outline"
							className="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
						>
							Get In Touch
						</ScrollButton>
					</div>
				</div>
			</div>
		</section>
	);
}
