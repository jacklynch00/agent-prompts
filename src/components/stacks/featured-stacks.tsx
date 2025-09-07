'use client';

import { usePopularStacks } from '@/hooks/use-stacks';
import { StackCard } from './stack-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function FeaturedStacks() {
	const { data: stacks, isLoading, error } = usePopularStacks(6);

	if (error) {
		return (
			<section className='py-16 bg-background'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center text-destructive'>Failed to load featured stacks. Please try again later.</div>
				</div>
			</section>
		);
	}

	return (
		<section className='py-16 bg-background'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Section header */}
				<div className='text-center mb-12'>
					<div className='inline-flex items-center px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4'>
						<TrendingUp className='h-4 w-4 mr-2' />
						Most Popular
					</div>
					<h2 className='text-3xl sm:text-4xl font-bold text-foreground mb-4'>Featured Tech Stacks</h2>
					<p className='max-w-2xl mx-auto text-lg text-muted-foreground'>
						Discover the most popular and highly-rated tech stacks with their specialized AI agents. Perfect for modern development workflows.
					</p>
				</div>

				{/* Loading state */}
				{isLoading && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className='h-96 bg-muted rounded-lg animate-pulse' />
						))}
					</div>
				)}

				{/* Stacks grid */}
				{stacks && stacks.length > 0 && (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
							{stacks.map((stack) => (
								<StackCard key={stack.id} stack={stack} />
							))}
						</div>

						{/* CTA to view all stacks */}
						<div className='text-center'>
							<Button size='lg' asChild>
								<Link href='/stacks'>
									View All Stacks
									<ArrowRight className='h-4 w-4 ml-2' />
								</Link>
							</Button>
							<p className='mt-4 text-sm text-muted-foreground'>
								{stacks.length > 6 ? `Showing 6 of ${stacks.length} available stacks` : `${stacks.length} stacks available`}
							</p>
						</div>
					</>
				)}

				{/* Empty state */}
				{stacks && stacks.length === 0 && (
					<div className='text-center py-12'>
						<div className='text-muted-foreground mb-4'>
							<TrendingUp className='h-12 w-12 mx-auto' />
						</div>
						<h3 className='text-lg font-medium text-foreground mb-2'>No stacks available</h3>
						<p className='text-muted-foreground'>We&apos;re working on adding more tech stacks. Check back soon!</p>
					</div>
				)}
			</div>
		</section>
	);
}
