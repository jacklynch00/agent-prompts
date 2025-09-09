import { BetaBanner } from '@/components/layout/beta-banner';
import { HeroSection } from '@/components/layout/hero-section';
import { PricingSection } from '@/components/layout/pricing';
import { FeaturedAgents } from '@/components/agents/featured-agents';

export default function Home() {
	return (
		<div className='min-h-screen bg-background'>
			<BetaBanner />
			<div className='max-w-7xl mx-auto'>
				<HeroSection />
				<FeaturedAgents />
				<PricingSection />
			</div>
		</div>
	);
}
