import { ScrollButton } from "../molecules/scroll-button";

export default function HeroSection() {
	return (
		<section className="pt-60 pb-45">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center animate-fade-in">
					<h1 className="text-4xl md:text-6xl font-bold text-color2 mb-8">Hi, Welcome to my site!</h1>
					<p className="text-xl text-color4 mb-2 max-w-2xl mx-auto text-left">
						Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.
					</p>
					<p className="text-xl text-color4 mb-8 max-w-2xl mx-auto text-right">-Richard Feynman</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<ScrollButton
							target="#posts"
							className="bg-color2 text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors duration-200 cursor-pointer"
						>
							View My Work
						</ScrollButton>
						<ScrollButton
							target="#contact"
							variant="outline"
							className="border-2 border-color6 text-color2 px-8 py-3 rounded-lg font-medium hover:bg-color1 hover:text-color2 hover:scale-105 transition-all duration-200 cursor-pointer"
						>
							Get In Touch
						</ScrollButton>
					</div>
				</div>
			</div>
		</section>
	);
}
