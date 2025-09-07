'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';

interface PurchaseButtonProps {
	className?: string;
	size?: 'sm' | 'default' | 'lg';
	variant?: 'default' | 'outline' | 'secondary';
	children?: React.ReactNode;
}

export function PurchaseButton({ className, size = 'default', variant = 'default', children }: PurchaseButtonProps) {
	const { data: session } = useSession();

	// If user is logged in, redirect to dashboard
	if (session?.user) {
		return (
			<Button asChild size={size} variant={variant} className={className}>
				<Link href="/dashboard">
					{children || 'Go to Dashboard'}
				</Link>
			</Button>
		);
	}

	// If user is not logged in, redirect to signup
	return (
		<Button asChild size={size} variant={variant} className={className}>
			<Link href="/auth/signup">
				{children || 'Get Started'}
			</Link>
		</Button>
	);
}
