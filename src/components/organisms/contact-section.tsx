"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
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

	const contactInfo = [
		{
			icon: <Mail className="text-blue-600" />,
			title: "Email",
			value: personalInfo.email,
			bgColor: "bg-blue-100",
		},
		{
			icon: <Phone className="text-green-600" />,
			title: "Phone",
			value: personalInfo.phoneNumber,
			bgColor: "bg-green-100",
		},
		{
			icon: <MapPin className="text-purple-600" />,
			title: "Location",
			value: personalInfo.location,
			bgColor: "bg-purple-100",
		},
	];

	const socialLinks = [
		{ icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bhuvaneshwaran-m-563a94271/", color: "hover:bg-blue-600" },
		{ icon: FaGithub, href: "https://github.com/felix-ops", color: "hover:bg-slate-800" },
	];

	return (
		<section id="contact" className="py-20 bg-slate-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Get In Touch</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Ready to bring your ideas to life? Let&apos;s discuss your next 3D project or simulation.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-12">
						{/* Contact Information */}
						<div className="space-y-8">
							<div>
								<h3 className="text-2xl font-semibold text-primary mb-6">Let&apos;s Connect</h3>
								<div className="space-y-4">
									{contactInfo.map((info, index) => (
										<div key={index} className="flex items-center space-x-4">
											<div
												className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
											>
												{info.icon}
											</div>
											<div>
												<p className="font-medium text-slate-900">{info.title}</p>
												<p className="text-slate-600">{info.value}</p>
											</div>
										</div>
									))}
								</div>
							</div>

							<div>
								<h4 className="text-lg font-semibold text-primary mb-4">Follow Me On</h4>
								<div className="flex space-x-4">
									{socialLinks.map((social, index) => (
										<a
											key={index}
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className={`w-10 h-10 bg-slate-200 ${social.color} text-slate-600 hover:text-white rounded-lg flex items-center justify-center transition-colors duration-200`}
										>
											<social.icon className="w-5 h-5" />
										</a>
									))}
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<Label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
										Your name:
									</Label>
									<Input
										id="name"
										type="text"
										required
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										placeholder="Your full name"
										className="w-full"
									/>
								</div>

								<div>
									<Label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
										Email:
									</Label>
									<Input
										id="email"
										type="email"
										required
										value={formData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
										placeholder="your@email.com"
										className="w-full"
									/>
								</div>

								<div>
									<Label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
										Your message:
									</Label>
									<Textarea
										id="message"
										required
										value={formData.message}
										onChange={(e) => handleInputChange("message", e.target.value)}
										placeholder="Tell me about your project..."
										className="w-full h-32 resize-vertical"
									/>
								</div>

								<Button
									type="submit"
									disabled={contactMutation.isPending}
									className="cursor-pointer w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
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
