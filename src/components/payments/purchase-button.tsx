'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

interface PurchaseButtonProps {
	productType?: 'full_access';
	className?: string;
	size?: 'sm' | 'default' | 'lg';
	variant?: 'default' | 'outline' | 'secondary';
	children?: React.ReactNode;
}

export function PurchaseButton({ productType = 'full_access', className, size = 'default', variant = 'default', children }: PurchaseButtonProps) {
	const [loading, setLoading] = useState(false);
	const { data: session } = useSession();

	const handlePurchase = async () => {
		if (loading) return;

		// Redirect to sign in if not authenticated
		if (!session) {
			window.location.href = '/auth/signin?redirect=' + encodeURIComponent(window.location.pathname);
			return;
		}

		setLoading(true);

		try {
			const response = await fetch('/api/payments/create-checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					productType,
				}),
			});

			const result = await response.json();

			if (result.success) {
				// Redirect to Polar checkout
				window.location.href = result.data.checkoutUrl;
			} else {
				console.error('Failed to create checkout:', result.error);
				alert('Failed to start checkout process. Please try again.');
			}
		} catch (error) {
			console.error('Purchase error:', error);
			alert('Something went wrong. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button onClick={handlePurchase} disabled={loading} size={size} variant={variant} className={className}>
			{loading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
			{children || (
				<>
					{loading && 'Processing...'}
					{!loading && <ExternalLink className='h-4 w-4 ml-2' />}
				</>
			)}
		</Button>
	);
}
