import { HeroSection } from '@/components/layout/hero-section';
import { PricingSection } from '@/components/layout/pricing';
import { FeaturedStacks } from '@/components/stacks/featured-stacks';

export default function Home() {
	return (
		<div className='min-h-screen bg-background'>
			<div className='max-w-7xl mx-auto'>
				<HeroSection />
				<FeaturedStacks />
				<PricingSection />
			</div>
		</div>
	);
}
