import Image from "next/image";

export default function AboutSection() {
	const skills = ["Blender", "Unity 3D", "Maya", "Unreal Engine", "Python", "C#"];

	return (
		<section id="about" className="py-20 bg-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-8xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About Me</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Passionate about creating stunning 3D visualizations and complex simulations that solve real-world
							problems.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="animate-slide-up">
							<div className="relative w-full max-w-md h-80 mx-auto">
								<Image
									src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"
									alt="Professional headshot"
									fill
									className="rounded-2xl shadow-lg object-cover"
									sizes="(max-width: 768px) 100vw, 33vw"
								/>
							</div>
						</div>

						<div className="animate-slide-up">
							<div className="space-y-6">
								<div>
									<h3 className="text-2xl font-semibold text-slate-900 mb-4">My Journey</h3>
									<p className="text-slate-600 leading-relaxed mb-4 max-w-xl">
										My world is built at the intersection of science and art. I started my journey in Physics, driven to
										understand the &quot;rules&quot; of reality. Today, I use that same curiosity to create new
										realities. As a Creative Technologist, I use code and 3D art as my tools to build immersive worlds
										that people can explore and interact with.
									</p>
									<p className="text-slate-600 leading-relaxed max-w-xl">
										My work spans from architectural visualizations and product prototypes to physics simulations and
										interactive experiences that help clients visualize and understand their projects before
										implementation.
									</p>
								</div>

								<div>
									<h4 className="text-lg font-semibold text-slate-900 mb-3">Core Skills</h4>
									<div className="grid grid-cols-2 gap-3">
										{skills.map((skill, index) => (
											<div key={index} className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-[#4d4d4d] rounded-full"></div>
												<span className="text-slate-700">{skill}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
