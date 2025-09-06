'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
	return (
		<section className='relative overflow-hidden bg-background pt-12'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32'>
				<div className='flex flex-col md:flex-row gap-12 lg:gap-16 items-center justify-between'>
					<div className='text-center sm:text-left space-y-2 max-w-xl md:max-w-[420px]'>
						<div>
							<Badge variant='outline' className='px-4 py-1.5 text-sm font-medium'>
								<Zap className='h-3 w-3 mr-1.5' />
								Stop Wasting Time Fighting With AI
							</Badge>
						</div>

						<div className='space-y-6'>
							<h1 className='text-xl sm:text-3xl font-bold tracking-snug text-foreground sm:leading-12'>
								Start coding projects{' '}
								<span className='bg-primary text-white p-1 rounded' style={{ transform: 'rotate(1.5deg)', display: 'inline-block' }}>
									faster
								</span>
								, <br />
								without telling AI what to do <br />
								<span className='bg-white text-black p-1 rounded' style={{ transform: 'rotate(-1.5deg)', display: 'inline-block' }}>
									every. single. time
								</span>
							</h1>
							<p className='text-base sm:text-lg text-muted-foreground'>
								Copy-paste prompts that give Claude, ChatGPT and Cursor deep knowledge of your tech stack and coding style.
							</p>
						</div>

						<div className='flex flex-col sm:flex-row gap-4'>
							<Button size='lg' variant='default' asChild className='px-8 py-3'>
								<Link href='#pricing'>
									<Brain className='h-4 w-4 mr-2' />
									Get Full Stack Agents
								</Link>
							</Button>
						</div>
					</div>

					<div className='w-[420px] aspect-square bg-muted rounded-2xl border-2 border-dashed border-border flex items-center justify-center'>
						<Image src='/hero-image.svg' alt='Hero Image' width={420} height={420} />
					</div>
				</div>
			</div>
		</section>
	);
}
