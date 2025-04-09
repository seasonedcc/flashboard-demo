function Footer() {
	return (
		<footer aria-labelledby="footer-heading" className="bg-white">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-10">
				<p className="text-sm text-gray-500">
					&copy; {new Date().getFullYear()} All Rights Reserved
				</p>
			</div>
		</footer>
	);
}

export { Footer };
