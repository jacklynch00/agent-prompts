'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bot, Github, Loader2, AlertCircle } from 'lucide-react';
import { signIn } from '@/lib/auth-client';

export function SignInForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		if (loading) return;

		setLoading(true);
		setError(null);

		try {
			const result = await signIn.email({
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message || 'Failed to sign in');
			} else {
				router.push('/dashboard');
			}
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setLoading(false);
		}
	};

	const handleGithubSignIn = async () => {
		if (loading) return;

		setLoading(true);
		setError(null);

		try {
			await signIn.social({
				provider: 'github',
				callbackURL: '/dashboard',
			});
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to sign in with GitHub');
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader className='text-center'>
				<div className='flex items-center justify-center gap-2 mb-2'>
					<div className='flex items-center justify-center w-8 h-8 bg-primary rounded-lg'>
						<Bot className='h-4 w-4 text-primary-foreground' />
					</div>
					<span className='font-bold text-lg'>Agent Prompts</span>
				</div>
				<CardTitle className='text-2xl'>Sign In</CardTitle>
				<CardDescription>Sign in to your account to access premium agents</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				{error && (
					<div className='flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg'>
						<AlertCircle className='h-4 w-4' />
						{error}
					</div>
				)}

				{/* Email/Password Form */}
				<form onSubmit={handleEmailSignIn} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input id='email' type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>

					<div className='space-y-2'>
						<Label htmlFor='password'>Password</Label>
						<Input id='password' type='password' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>

					<Button type='submit' className='w-full' disabled={loading}>
						{loading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
						Sign In
					</Button>
				</form>

				<div className='relative'>
					<Separator />
					<div className='absolute inset-0 flex items-center justify-center'>
						<span className='bg-background px-2 text-sm text-muted-foreground'>or</span>
					</div>
				</div>

				{/* GitHub Sign In */}
				<Button variant='outline' onClick={handleGithubSignIn} disabled={loading} className='w-full'>
					<Github className='h-4 w-4 mr-2' />
					Continue with GitHub
				</Button>

				{/* Sign Up Link */}
				<div className='text-center text-sm'>
					<span className='text-muted-foreground'>Don&apos;t have an account? </span>
					<Link href={`/auth/signup`} className='text-primary hover:underline'>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
