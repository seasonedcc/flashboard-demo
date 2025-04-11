import { Link } from 'react-router'
import { cx } from '~/helpers'

function Breadcrumb({
	links,
	dark = false,
}: { links: Array<{ name: string; href: string }>; dark?: boolean }) {
	return (
		<nav aria-label="Breadcrumb">
			<ol className="flex items-center space-x-2">
				{links.map((link, index) => (
					<li key={link.name}>
						<div className="flex items-center text-sm">
							<Link
								to={link.href}
								className={cx(
									dark
										? 'text-white'
										: 'font-medium text-gray-500 hover:text-gray-900'
								)}
							>
								{link.name}
							</Link>
							{index < links.length - 1 && (
								<svg
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
									className={cx(
										'ml-2 size-5 shrink-0',
										dark ? 'text-white' : 'text-gray-300'
									)}
								>
									<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
								</svg>
							)}
						</div>
					</li>
				))}
			</ol>
		</nav>
	)
}

export { Breadcrumb }
