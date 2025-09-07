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
import { signUp, signIn } from '@/lib/auth-client';
import Image from 'next/image';

export function SignUpForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleEmailSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (loading) return;

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (password.length < 8) {
			setError('Password must be at least 8 characters long');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await signUp.email({
				email,
				password,
				name,
			});

			if (result.error) {
				setError(result.error.message || 'Failed to create account');
			} else {
				router.push('/dashboard');
			}
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		if (loading) return;
		setLoading(true);
		setError(null);
		await signIn.social({
			provider: 'google',
			callbackURL: '/dashboard',
		});
	};

	const handleGithubSignUp = async () => {
		if (loading) return;

		setLoading(true);
		setError(null);
		await signIn.social({
			provider: 'github',
			callbackURL: '/dashboard',
		});
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
				<CardTitle className='text-2xl'>Create Account</CardTitle>
				<CardDescription>Create an account to access premium AI agents</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				{error && (
					<div className='flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg'>
						<AlertCircle className='h-4 w-4' />
						{error}
					</div>
				)}

				{/* Email/Password Form */}
				<form onSubmit={handleEmailSignUp} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Name</Label>
						<Input id='name' type='text' placeholder='Enter your full name' value={name} onChange={(e) => setName(e.target.value)} required />
					</div>

					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input id='email' type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>

					<div className='space-y-2'>
						<Label htmlFor='password'>Password</Label>
						<Input
							id='password'
							type='password'
							placeholder='Choose a password (min. 8 characters)'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='confirmPassword'>Confirm Password</Label>
						<Input
							id='confirmPassword'
							type='password'
							placeholder='Confirm your password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>

					<Button type='submit' className='w-full' disabled={loading}>
						{loading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
						Create Account
					</Button>
				</form>

				<div className='relative'>
					<Separator />
					<div className='absolute inset-0 flex items-center justify-center'>
						<span className='bg-background px-2 text-sm text-muted-foreground'>or</span>
					</div>
				</div>

				{/* Google Sign In */}
				<Button variant='outline' onClick={handleGoogleSignIn} disabled={loading} className='w-full'>
					<Image src='/hero-logos/google.png' alt='Google' className='h-4 w-4 mr-2' width={16} height={16} />
					Continue with Google
				</Button>

				{/* GitHub Sign Up */}
				<Button variant='outline' onClick={handleGithubSignUp} disabled={loading} className='w-full'>
					<Github className='h-4 w-4 mr-2' />
					Continue with GitHub
				</Button>

				{/* Sign In Link */}
				<div className='text-center text-sm'>
					<span className='text-muted-foreground'>Already have an account? </span>
					<Link href={`/auth/signin`} className='text-primary hover:underline'>
						Sign in
					</Link>
				</div>

				{/* Terms */}
				<div className='text-xs text-center text-muted-foreground'>
					By creating an account, you agree to our{' '}
					<Link href='/terms' className='text-primary hover:underline'>
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link href='/privacy' className='text-primary hover:underline'>
						Privacy Policy
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
