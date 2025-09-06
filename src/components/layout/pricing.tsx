import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function PricingSection() {
	const pricingDetails = {
		price: 19,
		priceSuffix: '/one time',
		features: [
			['20+ Tech Stacks', 'All Agent Prompts', 'Lifetime Access'],
			['Cursor Integration', 'Claude Projects', 'ChatGPT Compatible'],
			['Copy-Paste Ready', 'Platform Formatting', 'Regular Updates'],
		],
		buttonText: 'Get Full Stack Agents',
	};
	return (
		<div className='max-w-7xl mx-auto'>
			<div className='mx-auto flex max-w-5xl flex-col items-center gap-6 text-center'>
				<h2 className='text-4xl font-semibold text-pretty lg:text-6xl'>Pricing</h2>
				{/* dynamic pricing based on number of people that have paid */}
				<div className='mx-auto flex w-full flex-col rounded-lg border p-6 sm:w-fit sm:min-w-80'>
					<div className='flex justify-center'>
						<span className='text-lg font-semibold'>$</span>
						<span className='text-6xl font-semibold'>{pricingDetails.price}</span>
						<span className='self-end text-muted-foreground'>{pricingDetails.priceSuffix}</span>
					</div>
					<div className='my-6'>
						{pricingDetails.features.map((featureGroup, idx) => (
							<div key={idx}>
								<ul className='flex flex-col gap-3'>
									{featureGroup.map((feature, i) => (
										<li key={i} className='flex items-center justify-between gap-2 text-sm font-medium'>
											{feature} <Check className='inline size-4 shrink-0' />
										</li>
									))}
								</ul>
								{idx < pricingDetails.features.length - 1 && <Separator className='my-6' />}
							</div>
						))}
					</div>
					<Button>{pricingDetails.buttonText}</Button>
				</div>
			</div>
		</div>
	);
}
