function Footer() {
	return (
		<footer aria-labelledby="footer-heading" className="bg-white">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
				<p className="text-gray-500 text-sm">
					&copy; {new Date().getFullYear()} &bull; Flashboard Demo Store
				</p>
			</div>
		</footer>
	)
}

export { Footer }
