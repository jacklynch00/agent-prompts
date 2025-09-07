'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { signUp } from '@/lib/auth-client';

interface AccountCreationFormProps {
	email: string;
	checkoutId: string;
	onAccountCreated?: () => void;
}

export function AccountCreationForm({ email, checkoutId, onAccountCreated }: AccountCreationFormProps) {
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleCreateAccount = async (e: React.FormEvent) => {
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
			// Use Better-auth's built-in signup
			const signUpResult = await signUp.email({
				email,
				password,
				name,
			});

			if (signUpResult.error) {
				setError(signUpResult.error.message || 'Failed to create account');
				return;
			}

			// If there's a checkoutId, link the purchase to the new user
			if (checkoutId && signUpResult.data?.user) {
				try {
					const response = await fetch('/api/auth/link-purchase', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							checkoutId,
							userId: signUpResult.data.user.id,
						}),
					});

					const result = await response.json();
					if (!result.success) {
						console.warn('Failed to link purchase to user:', result.error);
						// Don't fail the account creation if purchase linking fails
					}
				} catch (linkError) {
					console.warn('Failed to link purchase:', linkError);
				}
			}

			setSuccess(true);
			onAccountCreated?.();
		} catch (err) {
			setError((err as Error).message || 'An unexpected error occurred');
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<Card className='border-green-200 bg-green-50/50'>
				<CardContent className='pt-6'>
					<div className='text-center'>
						<div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4'>
							<CheckCircle className='h-6 w-6 text-green-600' />
						</div>
						<h3 className='text-lg font-semibold text-green-800 mb-2'>Account Created!</h3>
						<p className='text-green-700'>You&apos;re now signed in and have full access to all premium agents.</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='border-primary/20 bg-primary/5'>
			<CardHeader className='text-center'>
				<div className='flex items-center justify-center gap-2 mb-2'>
					<Crown className='h-5 w-5 text-primary' />
					<CardTitle className='text-lg text-primary'>Complete Your Access</CardTitle>
				</div>
				<CardDescription>Create an account to manage your premium access and get updates</CardDescription>
			</CardHeader>

			<CardContent className='space-y-4'>
				{error && (
					<div className='flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg'>
						<AlertCircle className='h-4 w-4' />
						{error}
					</div>
				)}

				<form onSubmit={handleCreateAccount} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email (from payment)</Label>
						<Input id='email' type='email' value={email} disabled className='bg-muted' />
					</div>

					<div className='space-y-2'>
						<Label htmlFor='name'>Your Name</Label>
						<Input
							id='name'
							type='text'
							placeholder='Enter your full name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='password'>Choose Password</Label>
						<Input
							id='password'
							type='password'
							placeholder='Password (min. 8 characters)'
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
						Create Account & Sign In
					</Button>
				</form>

				<div className='text-xs text-center text-muted-foreground'>
					By creating an account, you&apos;ll be able to:
					<ul className='mt-1 space-y-1 text-left'>
						<li>• Access premium agents anytime</li>
						<li>• Receive updates and new releases</li>
						<li>• Manage your subscription preferences</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}