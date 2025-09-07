'use client';

import { AgentService } from '@/data/agents';
import { AgentCard } from './agent-card';
import { TrendingUp } from 'lucide-react';

const FEATURED_AGENT_IDS = ['nextjs-expert', 'better-auth-expert', 'prisma-expert'];

export function FeaturedAgents() {
	const agents = FEATURED_AGENT_IDS.map(id => AgentService.getAgentById(id)).filter((agent): agent is NonNullable<typeof agent> => agent !== null);

	if (!agents.length) {
		return (
			<section className='py-16 bg-background'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center text-destructive'>Failed to load featured agents. Please try again later.</div>
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
					<h2 className='text-3xl sm:text-4xl font-bold text-foreground mb-4'>Featured AI Agents</h2>
					<p className='max-w-2xl mx-auto text-lg text-muted-foreground'>
						Discover our most popular and highly-rated AI agent prompts. Perfect for modern development workflows and completely free to use.
					</p>
				</div>

				{/* Agents grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{agents.map((agent) => (
						<AgentCard key={agent.id} agent={agent} />
					))}
				</div>
			</div>
		</section>
	);
}