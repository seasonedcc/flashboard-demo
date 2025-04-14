import { Link } from 'react-router'

type Props = {
	links: Array<{ name: string; href: string }>
	className?: string
}
function Breadcrumb({ links, className }: Props) {
	return (
		<nav aria-label="Breadcrumb" className={className}>
			<ol className="flex items-center space-x-2">
				{links.map((link, index) => (
					<li key={link.name}>
						<div className="flex items-center text-sm">
							<Link to={link.href} className="text-current">
								{link.name}
							</Link>
							{index < links.length - 1 && (
								<svg
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
									className="ml-2 size-5 shrink-0 text-current"
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
