'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Lock, ArrowLeft, Sparkles, FileText } from 'lucide-react';
import { useUserPurchases } from '@/hooks/queries/use-user-purchases';
import Link from 'next/link';
import { AgentService } from '@/data/agents';

const FREE_AGENT_IDS = ['nextjs-expert', 'typescript-expert', 'frontend-file-structure-expert'];

export default function AgentDetailPage() {
	const params = useParams();
	const agentId = params.id as string;
	const { data: session } = useSession();
	const { data: purchases } = useUserPurchases();
	const hasFullAccess = purchases?.hasFullAccess || false;

	// Get agent data
	const agent = React.useMemo(() => {
		return AgentService.getAgentById(agentId);
	}, [agentId]);

	const isFree = FREE_AGENT_IDS.includes(agentId);
	const canAccess = isFree || hasFullAccess;

	if (!agent) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24'>
				<Card className='max-w-md w-full mx-4'>
					<CardContent className='pt-6 text-center'>
						<h2 className='text-xl font-semibold mb-4'>Agent Not Found</h2>
						<p className='text-muted-foreground mb-4'>The requested agent could not be found.</p>
						<Button asChild>
							<Link href='/dashboard'>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Back to Dashboard
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24'>
				<Card className='max-w-md w-full mx-4'>
					<CardContent className='pt-6 text-center'>
						<h2 className='text-xl font-semibold mb-4'>Authentication Required</h2>
						<p className='text-muted-foreground mb-4'>Please sign in to view agent details.</p>
						<Button asChild>
							<Link href='/auth/signin'>Sign In</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleCopyContent = (content: string) => {
		navigator.clipboard.writeText(content);
		// You could add a toast notification here
	};

	const getPlatformIcon = (platformType: string) => {
		switch (platformType) {
			case 'cursor':
				return <img src='/hero-logos/cursor.svg' alt='Cursor' className='h-4 w-4' />;
			case 'claude_projects':
				return <img src='/hero-logos/claude.svg' alt='Claude' className='h-4 w-4' />;
			case 'claude_code':
				return <img src='/hero-logos/claude.svg' alt='Claude' className='h-4 w-4' />;
			case 'generic':
				return <FileText className='h-4 w-4' />;
			default:
				return <FileText className='h-4 w-4' />;
		}
	};

	const getPlatformName = (platformType: string) => {
		switch (platformType) {
			case 'cursor':
				return 'Cursor IDE';
			case 'claude_projects':
				return 'Claude Projects';
			case 'claude_code':
				return 'Claude Code';
			case 'generic':
				return 'Generic/Any Platform';
			default:
				return platformType;
		}
	};

	return (
		<div className='min-h-screen bg-background pt-24'>
			<div className='max-w-4xl mx-auto px-4 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center gap-4 mb-4'>
						<Button variant='ghost' size='sm' asChild>
							<Link href='/dashboard'>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Back to Agents
							</Link>
						</Button>
					</div>

					<div className='flex items-start justify-between'>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-2'>
								<h1 className='text-3xl font-bold'>{agent.name}</h1>
								{!canAccess && <Lock className='h-5 w-5 text-muted-foreground' />}
								{agent.isPremium && (
									<Badge variant='secondary' className='text-xs'>
										<Sparkles className='h-3 w-3 mr-1' />
										Premium
									</Badge>
								)}
							</div>
							<p className='text-lg text-muted-foreground mb-4'>{agent.description}</p>
							<div className='flex flex-wrap gap-2 mb-4'>
								<Badge variant='outline' className='capitalize'>
									{agent.category}
								</Badge>
								{agent.tags.slice(0, 5).map((tag) => (
									<Badge key={tag} variant='secondary' className='text-xs'>
										{tag}
									</Badge>
								))}
								{agent.tags.length > 5 && (
									<Badge variant='outline' className='text-xs'>
										+{agent.tags.length - 5} more
									</Badge>
								)}
							</div>
						</div>
					</div>
				</div>

				{!canAccess ? (
					<Card className='border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'>
						<CardHeader>
							<CardTitle className='text-yellow-800 dark:text-yellow-200 flex items-center gap-2'>
								<Lock className='h-5 w-5' />
								Premium Agent
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-yellow-700 dark:text-yellow-300 mb-4'>
								This agent is part of our premium collection. Upgrade to access all agent prompts and configurations.
							</p>
							<Button className='bg-yellow-600 hover:bg-yellow-700 text-white'>Upgrade to Premium</Button>
						</CardContent>
					</Card>
				) : (
					<div className='space-y-6'>
						{/* Agent Details */}
						<Card>
							<CardHeader>
								<CardTitle>Agent Information</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<h4 className='font-medium mb-2'>Role</h4>
										<p className='text-sm text-muted-foreground'>{agent.role}</p>
									</div>
									<div>
										<h4 className='font-medium mb-2'>Technologies</h4>
										<div className='flex flex-wrap gap-1'>
											{agent.technologies.map((tech) => (
												<Badge key={tech.name} variant='secondary' className='text-xs'>
													{tech.name} {tech.version}
												</Badge>
											))}
										</div>
									</div>
									<div>
										<h4 className='font-medium mb-2'>Version</h4>
										<p className='text-sm text-muted-foreground'>{agent.version}</p>
									</div>
									<div>
										<h4 className='font-medium mb-2'>Last Updated</h4>
										<p className='text-sm text-muted-foreground'>{new Date(agent.lastUpdated).toLocaleDateString()}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Platform Configurations */}
						<Card>
							<CardHeader>
								<CardTitle>Platform Configurations</CardTitle>
							</CardHeader>
							<CardContent>
								<Tabs defaultValue={agent.platforms[0]?.type} className='w-full'>
									<TabsList className='grid w-full grid-cols-2 lg:grid-cols-4'>
										{agent.platforms.map((platform) => (
											<TabsTrigger key={platform.type} value={platform.type} className='flex items-center gap-2'>
												{getPlatformIcon(platform.type)}
												<span className='hidden sm:inline'>{getPlatformName(platform.type)}</span>
											</TabsTrigger>
										))}
									</TabsList>
									{agent.platforms.map((platform) => (
										<TabsContent key={platform.type} value={platform.type} className='mt-6'>
											<div className='space-y-4'>
												<div className='flex items-center justify-between'>
													<h4 className='text-lg font-medium'>{getPlatformName(platform.type)} Configuration</h4>
													<Button size='sm' onClick={() => handleCopyContent(platform.content)} className='flex items-center gap-2'>
														<Copy className='h-4 w-4' />
														Copy
													</Button>
												</div>

												{platform.filename && (
													<div className='text-sm text-muted-foreground mb-2'>
														<strong>Filename:</strong> {platform.filename}
													</div>
												)}

												<div className='relative'>
													<pre className='bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto'>
														<code className='text-slate-800 dark:text-slate-200'>{platform.content}</code>
													</pre>
												</div>

												{platform.setupInstructions && (
													<div>
														<h5 className='font-medium mb-2'>Setup Instructions</h5>
														<ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
															{platform.setupInstructions.map((instruction, index) => (
																<li key={index}>{instruction}</li>
															))}
														</ul>
													</div>
												)}
											</div>
										</TabsContent>
									))}
								</Tabs>
							</CardContent>
						</Card>

						{/* Usage Information */}
						<Card>
							<CardHeader>
								<CardTitle>Usage Information</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<h4 className='font-medium mb-2'>Use Cases</h4>
										<ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
											{agent.metadata.useCases.map((useCase, index) => (
												<li key={index} className='capitalize'>
													{useCase.replace('-', ' ')}
												</li>
											))}
										</ul>
									</div>
									<div>
										<h4 className='font-medium mb-2'>Project Types</h4>
										<ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
											{agent.metadata.projectTypes.map((projectType, index) => (
												<li key={index} className='capitalize'>
													{projectType.replace('-', ' ')}
												</li>
											))}
										</ul>
									</div>
									<div>
										<h4 className='font-medium mb-2'>Estimated Setup Time</h4>
										<p className='text-sm text-muted-foreground'>{agent.metadata.estimatedSetupTime}</p>
									</div>
									<div>
										<h4 className='font-medium mb-2'>Author</h4>
										<p className='text-sm text-muted-foreground'>{agent.metadata.author}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Related Agents */}
						{agent.relatedAgents && agent.relatedAgents.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>Related Agents</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex flex-wrap gap-2'>
										{agent.relatedAgents.map((relatedAgentId) => (
											<Badge key={relatedAgentId} variant='outline' className='capitalize'>
												{relatedAgentId.replace('-expert', '').replace('-', ' ')}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
