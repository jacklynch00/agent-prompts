'use client';

import { Check, Users, TrendingUp } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { usePricingTier } from '@/hooks/use-purchase-stats';
import { PurchaseButton } from '@/components/payments/purchase-button';

export function PricingSection() {
	const { totalPurchases, currentPrice, remainingInTier, isLoading, error } = usePricingTier();

	const pricingDetails = {
		price: isLoading ? 19 : currentPrice,
		priceSuffix: '/one time',
		features: [
			['20+ Tech Stacks', 'All Agent Prompts', 'Lifetime Access'],
			['Copy-Paste Ready', 'Regular Updates to agents', 'Access to all new agents'],
		],
		buttonText: 'Get Full Stack Agents',
	};

	// Calculate progress percentage
	const getProgressPercentage = () => {
		if (totalPurchases < 100) {
			return (totalPurchases / 100) * 33.33; // First third
		} else if (totalPurchases < 1000) {
			return 33.33 + ((totalPurchases - 100) / 900) * 33.33; // Second third
		} else {
			return 66.66 + Math.min(((totalPurchases - 1000) / 1000) * 33.34, 33.34); // Final third
		}
	};

	const progressPercentage = getProgressPercentage();
	return (
		<div id='pricing' className='max-w-7xl mx-4 sm:mx-auto'>
			<div className='mx-auto flex max-w-5xl flex-col items-center gap-6 text-center'>
				<h2 className='text-4xl font-semibold text-pretty lg:text-6xl'>Pricing</h2>

				{/* Progress Bar and Social Proof */}
				{!isLoading && !error && (
					<div className='w-full max-w-md space-y-4'>
						{/* Social proof */}
						<div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
							<Users className='h-4 w-4' />
							<span>{totalPurchases} users have joined</span>
						</div>

						{/* Progress bar */}
						<div className='space-y-4'>
							<div className='relative'>
								<Progress value={progressPercentage} className='h-3' />

								{/* Milestone markers */}
								<div className='absolute top-[2px] w-full flex justify-between items-center'>
									<div className='flex flex-col items-center'>
										<div className='w-2 h-2 bg-background border-2 border-primary rounded-full'></div>
										<span className='text-xs font-semibold text-primary mt-1'>$19</span>
									</div>
									<div className='flex flex-col items-center'>
										<div
											className={`w-2 h-2 rounded-full border-2 ${totalPurchases >= 100 ? 'bg-primary border-primary' : 'bg-background border-muted'}`}></div>
										<span className={`text-xs font-semibold mt-1 ${totalPurchases >= 100 ? 'text-primary' : 'text-muted-foreground'}`}>$29</span>
									</div>
									<div className='flex flex-col items-center'>
										<div
											className={`w-2 h-2 rounded-full border-2 ${
												totalPurchases >= 1000 ? 'bg-primary border-primary' : 'bg-background border-muted'
											}`}></div>
										<span className={`text-xs font-semibold mt-1 ${totalPurchases >= 1000 ? 'text-primary' : 'text-muted-foreground'}`}>$39</span>
									</div>
								</div>
							</div>

							{/* Urgency message */}
							{remainingInTier && remainingInTier > 0 && (
								<div className='flex items-center justify-center gap-1 text-sm'>
									<TrendingUp className='h-4 w-4 text-orange-500' />
									<span className='text-orange-600'>
										Only {remainingInTier} spots left at ${currentPrice}!
									</span>
								</div>
							)}
						</div>
					</div>
				)}
				<div className='mx-auto flex w-full flex-col rounded-lg border p-6 sm:w-fit sm:min-w-80'>
					<div className='flex justify-center'>
						<span className='text-lg font-semibold'>$</span>
						<span className='text-6xl font-semibold'>{pricingDetails.price}</span>
						<span className='self-end text-muted-foreground'>{pricingDetails.priceSuffix}</span>
					</div>
					
					{/* Beta discount badge */}
					<div className='mt-4 mx-auto'>
						<div className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-full'>
							<span className='text-sm font-semibold text-green-700 dark:text-green-300'>
								🎉 Use code <code className='bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-green-800 dark:text-green-200 font-mono'>&quot;beta&quot;</code> for FREE access!
							</span>
						</div>
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
					<PurchaseButton size='lg' className='w-full'>
						{pricingDetails.buttonText}
					</PurchaseButton>
				</div>
			</div>
		</div>
	);
}
