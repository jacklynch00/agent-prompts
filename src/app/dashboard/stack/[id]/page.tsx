'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock, ArrowLeft, Users, Code, Star } from 'lucide-react';
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useStack } from '@/hooks/queries/use-stack';
import { useUserPurchases } from '@/hooks/queries/use-user-purchases';
import { useCreateCheckout } from '@/hooks/mutations/use-create-checkout';
import { useQueryClient } from '@tanstack/react-query';

const FREE_STACK_IDS = ['nextjs-t3', 'mern-stack', 'python-fastapi'];

export default function DashboardStackPage() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: session, isPending } = useSession();
	
	const stackId = params.id as string;
	const isFreeStack = FREE_STACK_IDS.includes(stackId);
	
	// Use custom hooks
	const { data: stack, isLoading: stackLoading, error: stackError } = useStack(stackId);
	const { data: purchases, isLoading: purchasesLoading } = useUserPurchases();
	const createCheckoutMutation = useCreateCheckout();

	useEffect(() => {
		if (!isPending && !session?.user) {
			// Redirect guests to public stack page
			router.replace(`/stacks/${stackId}`);
		}
	}, [session, isPending, stackId, router]);

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

	if (isPending || stackLoading || purchasesLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	if (!session?.user) {
		return null; // Will redirect in useEffect
	}

	if (stackError || !stack) {
		return (
			<div className='min-h-screen bg-background pt-24'>
				<div className='max-w-4xl mx-auto px-4 py-8'>
					<Card>
						<CardContent className='pt-6 text-center'>
							<h2 className='text-xl font-semibold mb-2'>Stack Not Found</h2>
							<p className='text-muted-foreground mb-4'>The requested stack could not be found.</p>
							<Button asChild>
								<Link href='/dashboard'>
									<ArrowLeft className='h-4 w-4 mr-2' />
									Back to Dashboard
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const hasAccess = isFreeStack || purchases?.hasFullAccess;

	return (
		<div className='min-h-screen bg-background pt-24'>
			<div className='max-w-4xl mx-auto px-4 py-8'>
				{/* Back Button */}
				<Button variant='ghost' asChild className='mb-6'>
					<Link href='/dashboard'>
						<ArrowLeft className='h-4 w-4 mr-2' />
						Back to Dashboard
					</Link>
				</Button>

				{/* Stack Header */}
				<div className='mb-8'>
					<div className='flex items-center gap-3 mb-4'>
						<h1 className='text-3xl font-bold'>{stack.name}</h1>
						{isFreeStack ? (
							<Badge className='bg-green-100 text-green-800'>FREE</Badge>
						) : (
							<Badge className='bg-yellow-100 text-yellow-800'>
								<Crown className='h-3 w-3 mr-1' />
								Premium
							</Badge>
						)}
					</div>
					<p className='text-muted-foreground text-lg mb-4'>{stack.description}</p>

					<div className='flex flex-wrap gap-2 mb-4'>
						{stack.technologies.map((tech) => (
							<Badge key={tech} variant='secondary'>
								{tech}
							</Badge>
						))}
					</div>

					<div className='flex items-center gap-4 text-sm text-muted-foreground'>
						<div className='flex items-center gap-1'>
							<Users className='h-4 w-4' />
							{stack.agents?.length || 0} agents
						</div>
						<div className='flex items-center gap-1'>
							<Code className='h-4 w-4' />
							{stack.category}
						</div>
					</div>
				</div>

				{/* Premium Upgrade Prompt */}
				{!hasAccess && (
					<Card className='mb-8 border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'>
						<CardHeader>
							<div className='flex items-center gap-3'>
								<Crown className='h-6 w-6 text-yellow-600' />
								<div>
									<CardTitle className='text-xl text-yellow-800 dark:text-yellow-200'>Premium Stack Access Required</CardTitle>
									<p className='text-yellow-700 dark:text-yellow-300 mt-1'>Upgrade to access this stack and all premium agents</p>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col sm:flex-row gap-4 items-center'>
								<Button onClick={handleUpgrade} disabled={createCheckoutMutation.isPending} size='lg' className='bg-yellow-600 hover:bg-yellow-700 text-white'>
									{createCheckoutMutation.isPending ? 'Processing...' : '💎 Upgrade Now - $19'}
									<Crown className='h-4 w-4 ml-2' />
								</Button>
								<p className='text-sm text-yellow-600 dark:text-yellow-400'>⚡ Instant access to all premium stacks</p>
							</div>
						</CardContent>
					</Card>
				)}

				{/* AI Agents */}
				<div className='space-y-6'>
					<h2 className='text-2xl font-bold flex items-center gap-2'>
						<Star className='h-6 w-6' />
						AI Agents ({stack.agents?.length || 0})
					</h2>

					{stack.agents?.map((agent) => (
						<Card key={agent.id} className={`${!hasAccess ? 'relative opacity-60' : 'hover:shadow-md transition-shadow'}`}>
							{!hasAccess && (
								<div className='absolute inset-0 bg-black/5 z-10 rounded-lg flex items-center justify-center'>
									<div className='bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg'>
										<Lock className='h-6 w-6 text-muted-foreground mx-auto mb-2' />
										<p className='text-sm font-medium text-center'>Premium Required</p>
									</div>
								</div>
							)}

							<CardHeader>
								<div className='flex items-center justify-between mb-4'>
									<div>
										<CardTitle className='text-xl mb-2'>{agent.name}</CardTitle>
										<p className='text-muted-foreground'>{agent.description}</p>
									</div>
									<div className='flex flex-wrap gap-1'>
										{agent.platforms?.slice(0, 3).map((platform, index) => {
											const platformName =
												typeof platform === 'object' && platform.type ? platform.type : typeof platform === 'string' ? platform : `Platform ${index + 1}`;
											return (
												<Badge key={`platform-${index}`} variant='outline' className='text-xs capitalize'>
													{platformName}
												</Badge>
											);
										})}
										{agent.platforms && agent.platforms.length > 3 && (
											<Badge variant='outline' className='text-xs'>
												+{agent.platforms.length - 3}
											</Badge>
										)}
									</div>
								</div>
							</CardHeader>

							<CardContent>
								{hasAccess ? (
									<div className='space-y-4'>
										{agent.role && (
											<div>
												<h5 className='font-semibold mb-2 flex items-center gap-2'>
													<Code className='h-4 w-4' />
													Agent Role
												</h5>
												<p className='text-sm bg-muted p-4 rounded-md border'>{agent.role}</p>
											</div>
										)}

										{agent.instructions && (
											<div>
												<h5 className='font-semibold mb-2'>Instructions</h5>
												<pre className='text-sm bg-muted p-4 rounded-md border whitespace-pre-wrap overflow-auto max-h-96'>{agent.instructions}</pre>
											</div>
										)}

										<div className='pt-4 border-t'>
											<Button
												className='w-full'
												onClick={() => {
													const textToCopy = `# ${agent.name}\n\n## Role\n${agent.role || 'AI Assistant'}\n\n## Instructions\n${
														agent.instructions || 'No specific instructions provided'
													}`;
													navigator.clipboard.writeText(textToCopy);
												}}>
												Copy Agent Prompt
											</Button>
											<p className='text-xs text-muted-foreground text-center mt-2'>
												Available for {agent.platforms?.length || 0} platform{agent.platforms?.length !== 1 ? 's' : ''}
											</p>
										</div>
									</div>
								) : (
									<div className='text-center py-8 text-muted-foreground'>
										<Lock className='h-8 w-8 mx-auto mb-2' />
										<p>Upgrade to access this agent&apos;s prompts and instructions</p>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
