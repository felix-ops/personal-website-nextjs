"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { FaLinkedinIn, FaGithub, FaRedditAlien, FaArtstation } from "react-icons/fa";
import { personalInfo } from "@/data/information";

export default function ContactSection() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		projectType: "",
		message: "",
	});
	const { toast } = useToast();

	const contactMutation = useMutation({
		mutationFn: async (data: typeof formData) => {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					access_key: "9185149c-c3af-411e-b77f-4368a933d06d",
					name: data.name,
					email: data.email,
					subject: data.projectType || "Portfolio Inquiry",
					message: data.message,
				}),
			});

			const result = await response.json();
			if (!response.ok || result.success !== true) {
				throw new Error(result.message || "Failed to send message");
			}
			return result;
		},
		onSuccess: () => {
			toast({
				title: "Message sent successfully!",
				description: "Thank you for your interest. I'll get back to you soon.",
			});
			setFormData({ name: "", email: "", projectType: "", message: "" });
		},
		onError: (error) => {
			toast({
				title: "Failed to send message",
				description: error.message || "Please try again later.",
				variant: "destructive",
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.message) {
			toast({
				title: "Please fill in all required fields",
				variant: "destructive",
			});
			return;
		}
		contactMutation.mutate(formData);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Temporary test function to see toasts
	// const testToasts = () => {
	// 	toast({
	// 		title: "Success Toast",
	// 		description: "This is what a success toast looks like!",
	// 	});

	// 	setTimeout(() => {
	// 		toast({
	// 			title: "Error Toast",
	// 			description: "This is what an error toast looks like!",
	// 			variant: "destructive",
	// 		});
	// 	}, 2000);
	// };

	const contactInfo = [
		{
			icon: <Mail className="text-color3" />,
			title: "Email",
			value: personalInfo.email,
			bgColor: "bg-color1/0",
		},
		{
			icon: <Phone className="text-color3" />,
			title: "Phone",
			value: personalInfo.phoneNumber,
			bgColor: "bg-color1/0",
		},
		{
			icon: <MapPin className="text-color3" />,
			title: "Location",
			value: personalInfo.location,
			bgColor: "bg-color1/0",
		},
	];

	const socialLinks = [
		{
			icon: FaLinkedinIn,
			href: "https://www.linkedin.com/in/bhuvaneshwaran-m-563a94271/",
			color: "hover:text-color1 hover:bg-[#0a66c2]",
		},
		{ icon: FaGithub, href: "https://github.com/felix-ops", color: "hover:text-color1 hover:bg-slate-800" },
		{
			icon: FaRedditAlien,
			href: "https://www.reddit.com/user/FELIX-Zs/",
			color: "hover:text-color1 hover:bg-[#FF4500]",
		},
		{
			icon: FaArtstation,
			href: "https://www.artstation.com/bhuvaneshwaran_m",
			color: "hover:bg-[#313131] hover:text-[#13AFF0]",
		},
	];

	return (
		<section id="contact" className="py-20 bg-color1">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-color2 mb-4">Get In Touch</h2>
						<p className="text-lg text-color4 max-w-2xl mx-auto">
							Got an idea or question? I&lsquo;m just a message away
						</p>
						{/* Temporary test button - remove this after testing */}
						{/* <button onClick={testToasts} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
							Test Toasts
						</button> */}
					</div>

					<div className="grid lg:grid-cols-2 gap-12">
						{/* Contact Information */}
						<div className="space-y-8">
							<div>
								<h3 className="text-2xl font-semibold text-color2 mb-6">Let&apos;s Connect</h3>
								<div className="space-y-4">
									{contactInfo.map((info, index) => (
										<div key={index} className="flex items-center space-x-4">
											<div
												className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
											>
												{info.icon}
											</div>
											<div>
												<p className="font-semibold text-color3">{info.title}</p>
												<p className="text-color4">{info.value}</p>
											</div>
										</div>
									))}
								</div>
							</div>

							<div>
								<h4 className="text-lg font-semibold text-color2 mb-4">Follow Me On</h4>
								<div className="flex space-x-5">
									{socialLinks.map((social, index) => (
										<a
											key={index}
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className={`w-12 h-12 text-color4 shadow-md hover:shadow-lg ${social.color} rounded-full flex items-center justify-center transition-all duration-200`}
										>
											<social.icon className="w-7 h-7" />
										</a>
									))}
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<div className="bg-color6 rounded-xl shadow-md border-0 border-color6 p-6">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<Label htmlFor="name" className="block text-sm font-semibold text-color3 mb-2">
										Your name:
									</Label>
									<Input
										id="name"
										type="text"
										required
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										placeholder="Your full name"
										className="w-full bg-color1"
									/>
								</div>

								<div>
									<Label htmlFor="email" className="block text-sm font-semibold text-color3 mb-2">
										Email:
									</Label>
									<Input
										id="email"
										type="email"
										required
										value={formData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
										placeholder="your@email.com"
										className="w-full bg-color1"
									/>
								</div>

								<div>
									<Label htmlFor="message" className="block text-sm font-semibold text-color3 mb-2">
										Your message:
									</Label>
									<Textarea
										id="message"
										required
										value={formData.message}
										onChange={(e) => handleInputChange("message", e.target.value)}
										placeholder="Enter your message..."
										className="w-full h-20 resize-vertical bg-color1"
									/>
								</div>

								<Button
									type="submit"
									disabled={contactMutation.isPending}
									className="cursor-pointer w-full bg-color2 text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
								>
									{contactMutation.isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Sending...
										</>
									) : (
										"Send Message"
									)}
								</Button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
