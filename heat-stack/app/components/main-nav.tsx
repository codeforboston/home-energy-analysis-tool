import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '#app/utils/misc.tsx'
import { useOptionalUser, hasAdminRole  } from '#app/utils/user.ts'
import { Button } from './ui/button.tsx'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from './ui/dropdown-menu.tsx'

export function MainNav() {
	const location = useLocation()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const user = useOptionalUser()
	const isAdmin = hasAdminRole(user)

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Cases', href: '/cases' },
		isAdmin ? { label: 'Users', href: '/users' } : null,
		{ label: 'Privacy', href: '/privacy' },
	].filter(Boolean)

	const isActive = (href: string) => {
		if (href === '/') {
			return location.pathname === '/'
		}
		return location.pathname.startsWith(href)
	}

	return (
		<>
			<nav className="hidden items-center gap-6 md:flex">
				{navItems.map((item) => (
					<Link
						key={item.href}
						to={item.href}
						className={cn(
							'text-sm font-medium transition-colors hover:text-primary',
							isActive(item.href) ? 'text-foreground' : 'text-muted-foreground',
						)}
					>
						{item.label}
					</Link>
				))}
			</nav>

			<div className="md:hidden">
				<DropdownMenu
					open={isMobileMenuOpen}
					onOpenChange={setIsMobileMenuOpen}
				>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" aria-label="Toggle menu">
							<svg
								className="h-6 w-6"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									d={
										isMobileMenuOpen
											? 'M6 18L18 6M6 6l12 12'
											: 'M4 6h16M4 12h16M4 18h16'
									}
								/>
							</svg>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-40">
						{navItems.map((item) => (
							<DropdownMenuItem key={item.href} asChild>
								<Link
									to={item.href}
									className={cn(
										'w-full cursor-pointer',
										isActive(item.href) && 'bg-accent',
									)}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{item.label}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	)
}
