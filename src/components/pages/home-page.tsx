import AboutSection from "@/components/organisms/about-section";
import ContactSection from "@/components/organisms/contact-section";
import ExperienceSection from "@/components/organisms/experience-section";
import HeroSection from "@/components/organisms/hero-section";
import Navigation from "@/components/organisms/navbar";
import StoriesSection from "@/components/organisms/stories-section";

export default function HomePage() {
	return (
		<main>
			<Navigation />
			<HeroSection />
			<AboutSection />
			<ExperienceSection />
			<StoriesSection />
			<ContactSection />
		</main>
	);
}
