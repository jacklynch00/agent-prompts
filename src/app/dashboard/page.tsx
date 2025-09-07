'use client';

import * as React from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap } from 'lucide-react';
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';
import { useAgents } from '@/hooks/use-agents';
import { useUserPurchases } from '@/hooks/queries/use-user-purchases';
import { useCreateCheckout } from '@/hooks/mutations/use-create-checkout';
import { useQueryClient } from '@tanstack/react-query';
import { AgentsDataTable } from '@/components/dashboard/agents-data-table';
import Link from 'next/link';

const FREE_AGENT_IDS = ['nextjs-expert', 'typescript-expert', 'frontend-file-structure-expert']; // First 3 agents are free

export default function Dashboard() {
	const { data: session, isPending } = useSession();
	const queryClient = useQueryClient();

	// Use custom hooks
	const { data: agentsResponse, isLoading: agentsLoading } = useAgents();
	const { data: purchases, isLoading: purchasesLoading } = useUserPurchases();
	const createCheckoutMutation = useCreateCheckout();

	// Memoize agents to prevent unnecessary re-renders
	const agents = React.useMemo(() => {
		return agentsResponse?.data || [];
	}, [agentsResponse?.data]);

	// Get unique categories for filtering
	const categories = React.useMemo(() => {
		if (!agents || agents.length === 0) return [];
		const uniqueCategories = Array.from(new Set(agents.map((agent) => agent.category)));
		return uniqueCategories;
	}, [agents]);

	const handleUpgrade = async () => {
		try {
			const result = await createCheckoutMutation.mutateAsync({
				productType: 'full_access',
				embed: true,
			});

			const checkout = await PolarEmbedCheckout.create(result.checkoutUrl, 'dark');

			checkout.addEventListener('success', () => {
				// Refetch user purchases to update premium status
				queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
			});

			checkout.addEventListener('close', () => {
				// Handle checkout close
			});

			checkout.addEventListener('loaded', () => {
				// Handle checkout loaded
			});
		} catch (error) {
			console.error('Upgrade error:', error);
		}
	};

	if (isPending || purchasesLoading || agentsLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	// Filter agents into free and premium for upgrade banner
	const premiumAgents = agents.filter((agent) => !FREE_AGENT_IDS.includes(agent.id)) || [];

	if (!session?.user) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24'>
				<Card className='max-w-md w-full mx-4'>
					<CardContent className='pt-6 text-center'>
						<h2 className='text-xl font-semibold mb-4'>Please Sign In</h2>
						<p className='text-muted-foreground mb-4'>You need to be signed in to access your dashboard.</p>
						<Button asChild>
							<Link href='/auth/signin'>Sign In</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background pt-24'>
			<div className='max-w-6xl mx-auto px-4 py-8'>
				{/* Upgrade Prompt for Premium Access */}
				{!purchases?.hasFullAccess && (
					<Card className='mb-8 border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-lg'>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<Crown className='h-8 w-8 text-yellow-600' />
								<div>
									<CardTitle className='text-2xl text-yellow-800 dark:text-yellow-200'>🚀 Unlock {premiumAgents.length}+ Premium AI Agent Prompts</CardTitle>
									<p className='text-yellow-700 dark:text-yellow-300 mt-1'>Get instant access to specialized AI agent prompts for every technology</p>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className='grid md:grid-cols-2 gap-6 mb-6'>
								<div>
									<h4 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-3'>What you get:</h4>
									<ul className='space-y-2 text-sm text-yellow-700 dark:text-yellow-300'>
										<li className='flex items-center gap-2'>
											<Zap className='h-4 w-4' />
											{premiumAgents.length}+ premium agent prompts
										</li>
										<li className='flex items-center gap-2'>
											<Zap className='h-4 w-4' />
											Multi-platform support (Cursor, Claude, etc.)
										</li>
										<li className='flex items-center gap-2'>
											<Zap className='h-4 w-4' />
											Regular updates & new agents
										</li>
										<li className='flex items-center gap-2'>
											<Zap className='h-4 w-4' />
											One-time payment, lifetime access
										</li>
									</ul>
								</div>
								<div>
									<h4 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-3'>Premium agents include:</h4>
									<div className='flex flex-wrap gap-2'>
										{premiumAgents.slice(0, 6).map((agent) => (
											<span
												key={agent.id}
												className='bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium'>
												{agent.name}
											</span>
										))}
										{premiumAgents.length > 6 && (
											<span className='bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium'>
												+{premiumAgents.length - 6} more
											</span>
										)}
									</div>
								</div>
							</div>
							<div className='flex flex-col sm:flex-row gap-4 items-center'>
								<Button onClick={handleUpgrade} disabled={createCheckoutMutation.isPending} size='lg' className='bg-yellow-600 hover:bg-yellow-700 text-white'>
									{createCheckoutMutation.isPending ? 'Processing...' : '💎 Upgrade Now - $19'}
									<Crown className='h-4 w-4 ml-2' />
								</Button>
								<p className='text-sm text-yellow-600 dark:text-yellow-400'>⚡ Instant access</p>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Agents Data Table */}
				<div className='mb-8'>
					<div className='flex items-center gap-2 mb-6'>
						<h2 className='text-2xl font-bold'>AI Agent Prompts</h2>
						<span className='bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full'>{agents.length || 0} Available</span>
					</div>

					{agents && agents.length > 0 ? (
						<AgentsDataTable data={agents} categories={categories} />
					) : (
						<Card>
							<CardContent className='pt-6'>
								<div className='text-center text-muted-foreground'>
									<p>No agent prompts available at the moment.</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
