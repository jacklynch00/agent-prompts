import Link from 'next/link';
import { Bot } from 'lucide-react';

export function Footer() {
	return (
		<footer className='bg-background border-t mt-12'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Brand */}
					<div className='space-y-4'>
						<div className='flex items-center gap-3'>
							<div className='flex items-center justify-center w-8 h-8 bg-primary rounded-lg'>
								<Bot className='h-4 w-4 text-primary-foreground' />
							</div>
							<div className='flex flex-col'>
								<span className='font-bold text-lg text-foreground leading-tight'>Agent Prompts</span>
								<span className='text-xs text-muted-foreground leading-tight'>AI Development Tools</span>
							</div>
						</div>
						<p className='text-sm text-muted-foreground'>Copy-paste prompts that give Claude, ChatGPT and Cursor deep knowledge of your tech stack and coding style.</p>
					</div>

					{/* Product */}
					<div className='space-y-4'>
						<h3 className='font-semibold text-foreground'>Product</h3>
						<ul className='space-y-3'>
							<li>
								<Link href='/#pricing' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Pricing
								</Link>
							</li>
							<li>
								<Link href='/docs' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Documentation
								</Link>
							</li>
							<li>
								<Link href='/updates' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Updates
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div className='space-y-4'>
						<h3 className='font-semibold text-foreground'>Support</h3>
						<ul className='space-y-3'>
							<li>
								<Link href='/help' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Help Center
								</Link>
							</li>
							<li>
								<Link href='/contact' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Contact Us
								</Link>
							</li>
							<li>
								<Link href='/feedback' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Feedback
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div className='space-y-4'>
						<h3 className='font-semibold text-foreground'>Legal</h3>
						<ul className='space-y-3'>
							<li>
								<Link href='/privacy' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href='/terms' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href='/refunds' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
									Refund Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom section */}
				<div className='mt-12 pt-8 border-t border-border'>
					<div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
						<p className='text-sm text-muted-foreground'>© {new Date().getFullYear()} Agent Prompts. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
