'use client';

import { Sparkles } from 'lucide-react';

interface BetaBannerProps {
	show?: boolean;
}

export function BetaBanner({ show = true }: BetaBannerProps) {
	if (!show) return null;

	return (
		<div className='relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white'>
			<div className='max-w-7xl mx-auto px-4 py-2'>
				<div className='flex items-center justify-center'>
					<div className='flex items-center gap-2 justify-center'>
						<Sparkles className='h-4 w-4 text-yellow-300' />
						<div className='text-center'>
							<span className='font-semibold'>🎉 Beta Launch Special!</span>
							<span className='ml-2'>Use code <code className='bg-white/20 px-2 py-1 rounded font-mono font-bold'>&quot;beta&quot;</code> to get FREE access to all premium agents</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}