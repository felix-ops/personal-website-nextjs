import { info } from "@/data/information";

export default function Footer() {
	return (
		<footer className="bg-zinc-200 text-white py-5">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto text-center">
					<p className="text-slate-700 text-sm">
						© {info.currentYear} Bhuvaneshwaran M. All rights reserved. | ⛏️ Crafted with passion.
					</p>
				</div>
			</div>
		</footer>
	);
}
