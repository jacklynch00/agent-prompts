import { SignInForm } from '@/components/auth/signin-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign In - Agent Prompts',
	description: 'Sign in to your Agent Prompts account',
	robots: 'noindex, nofollow',
};

export default function SignInPage() {
	return (
		<div className='min-h-screen bg-background pt-24'>
			<div className='max-w-md mx-auto px-4 py-12'>
				<SignInForm />
			</div>
		</div>
	);
}