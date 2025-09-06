'use client';

import { Bot } from 'lucide-react';
import Link from 'next/link';
import { PurchaseButton } from '@/components/payments/purchase-button';

export function Navbar() {
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

						{/* Get Now button */}
						<div className='flex items-center gap-4'>
							<PurchaseButton size='sm' className='rounded-md'>
								Get Now
							</PurchaseButton>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
