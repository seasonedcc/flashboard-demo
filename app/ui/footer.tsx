function Footer() {
	return (
		<footer aria-labelledby="footer-heading" className="bg-white">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-center text-gray-500 text-sm sm:px-6 lg:px-8">
				<p>
					This is a demo store for Flashboard.{' '}
					<a
						href="https://www.getflashboard.com"
						target="_blank"
						rel="noreferrer"
						className="underline"
					>
						Create a demo panel
					</a>{' '}
					to edit this site in real time.
				</p>
				<p>&copy; {new Date().getFullYear()} &bull; Flashboard Demo Store</p>
			</div>
		</footer>
	)
}

export { Footer }
