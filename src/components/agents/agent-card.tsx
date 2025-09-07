'use client';

import { Agent } from '@/data/agents/agent.type';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar } from 'lucide-react';
import Link from 'next/link';

interface AgentCardProps {
	agent: Agent;
	showFullDescription?: boolean;
}

const FREE_AGENT_IDS = ['nextjs-expert', 'better-auth-expert', 'prisma-expert'];

export function AgentCard({ agent, showFullDescription = false }: AgentCardProps) {
	const isFree = FREE_AGENT_IDS.includes(agent.id);
	
	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'development':
				return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
			case 'authentication':
				return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
			case 'database':
				return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
			case 'testing':
				return 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20';
			case 'deployment':
				return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20';
			case 'architecture':
				return 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20';
			case 'styling':
				return 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20';
			default:
				return 'bg-muted text-muted-foreground hover:bg-muted/80';
		}
	};

	return (
		<Card className='h-full hover:shadow-lg transition-shadow duration-200'>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<div className='space-y-2'>
						<CardTitle className='text-xl font-bold'>{agent.name}</CardTitle>
						<div className='flex items-center gap-2 flex-wrap'>
							<Badge className={getCategoryColor(agent.category)}>{agent.category}</Badge>
						</div>
					</div>
				</div>
				<CardDescription className={showFullDescription ? '' : 'line-clamp-2'}>{agent.description}</CardDescription>
			</CardHeader>

			<CardContent className='space-y-4'>
				{/* Technologies */}
				<div>
					<h4 className='text-sm font-medium mb-2'>Technologies</h4>
					<div className='flex flex-wrap gap-1'>
						{agent.technologies.slice(0, 4).map((tech) => (
							<Badge key={tech.name} variant='secondary' className='text-xs'>
								{tech.name}
							</Badge>
						))}
						{agent.technologies.length > 4 && (
							<Badge variant='secondary' className='text-xs'>
								+{agent.technologies.length - 4} more
							</Badge>
						)}
					</div>
				</div>

				{/* Platforms count */}
				<div className='flex items-center justify-between text-sm text-muted-foreground'>
					<div className='flex items-center gap-1'>
						<Users className='h-4 w-4' />
						<span>{agent.platforms.length} platforms</span>
					</div>
				</div>

				{/* Last updated */}
				<div className='flex items-center gap-1 text-xs text-muted-foreground'>
					<Calendar className='h-3 w-3' />
					<span>Updated {new Date(agent.lastUpdated).toLocaleDateString()}</span>
				</div>

				{/* Action button */}
				<div className='pt-2'>
					<Button asChild className='w-full'>
						<Link href={isFree ? `/example/agent/${agent.id}` : `/dashboard/agent/${agent.id}`}>
							{isFree ? 'View Free Example' : 'View Agent Details'}
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}