'use client';

import { Bot, User, LogOut, Settings, Home } from 'lucide-react';
import Link from 'next/link';
import { PurchaseButton } from '@/components/payments/purchase-button';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navbar() {
	const { data: session } = useSession();

	return (
		<nav className='fixed top-4 left-4 right-4 z-50'>
			<div className='max-w-7xl mx-auto'>
				<div className='bg-background/80 backdrop-blur-md border rounded-2xl px-6 py-3 shadow-lg'>
					<div className='flex items-center justify-between'>
						{/* Logo and name */}
						<Link href='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
							<div className='flex items-center justify-center w-8 h-8 bg-primary rounded-lg'>
								<Bot className='h-4 w-4 text-primary-foreground' />
							</div>
							<div className='flex flex-col'>
								<span className='font-bold text-lg text-foreground leading-tight'>Agent Prompts</span>
								<span className='text-xs text-muted-foreground leading-tight'>AI Development Tools</span>
							</div>
						</Link>

						{/* Navigation for logged in users */}
						{session?.user ? (
							<div className='flex items-center gap-4'>
								{/* Navigation Links */}
								<div className='hidden md:flex items-center gap-1'>
									<Button variant='ghost' size='sm' asChild>
										<Link href='/dashboard' className='flex items-center gap-2'>
											<Home className='h-4 w-4' />
											Dashboard
										</Link>
									</Button>
								</div>

								{/* User Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='ghost' size='sm' className='flex items-center gap-2'>
											<div className='flex items-center justify-center w-6 h-6 bg-primary rounded-full'>
												<User className='h-3 w-3 text-primary-foreground' />
											</div>
											<span className='hidden sm:inline'>{session.user.name || session.user.email?.split('@')[0]}</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end' className='w-56'>
										<DropdownMenuLabel className='flex items-center gap-2'>{session.user.name || 'User'}</DropdownMenuLabel>
										<DropdownMenuSeparator />

										{/* Mobile Navigation */}
										<div className='md:hidden'>
											<DropdownMenuItem asChild>
												<Link href='/dashboard' className='flex items-center gap-2'>
													<Home className='h-4 w-4' />
													Dashboard
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href='/dashboard' className='flex items-center gap-2'>
													<Bot className='h-4 w-4' />
													Browse Stacks
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
										</div>

										<DropdownMenuItem disabled>
											<Settings className='h-4 w-4 mr-2' />
											Settings (Coming Soon)
										</DropdownMenuItem>

										<DropdownMenuSeparator />

										<DropdownMenuItem onClick={() => signOut()} className='text-red-600'>
											<LogOut className='h-4 w-4 mr-2' />
											Sign Out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						) : (
							/* Get Started button for guests */
							<div className='flex items-center gap-4'>
								<PurchaseButton size='sm' className='rounded-md'>
									Get Started
								</PurchaseButton>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
