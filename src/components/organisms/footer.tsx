export default function Footer() {
	return (
		<footer className="bg-color6 py-5">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto text-center">
					<p className="text-color3 text-sm">
						© {new Date().getFullYear().toString()} Bhuvaneshwaran M | ⛏️ Crafted with passion.
					</p>
				</div>
			</div>
		</footer>
	);
}
