import AboutSection from "@/components/organisms/about-section";
import ContactSection from "@/components/organisms/contact-section";
import ExperienceSection from "@/components/organisms/experience-section";
import HeroSection from "@/components/organisms/hero-section";
import Navigation from "@/components/organisms/navbar";
import PostsSection from "@/components/organisms/posts-section";
import Footer from "../organisms/footer";
import HomePage3D from "../organisms/home-page-3d";

export default function HomePage() {
	return (
		<main className="relative">
			{/* Fixed 3D background */}
			<div className="fixed inset-0 z-0">
				<HomePage3D />
			</div>

			{/* Content overlay */}
			<div className="relative z-10">
				<Navigation />
				<HeroSection />
				<AboutSection />
				<ExperienceSection />
				<PostsSection />
				<ContactSection />
				<Footer />
			</div>
		</main>
	);
}
