import { SignUpForm } from '@/components/auth/signup-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign Up - Agent Prompts',
	description: 'Create your Agent Prompts account',
	robots: 'noindex, nofollow',
};

export default function SignUpPage() {
	return (
		<div className='min-h-screen bg-background pt-24'>
			<div className='max-w-md mx-auto px-4 py-12'>
				<SignUpForm />
			</div>
		</div>
	);
}