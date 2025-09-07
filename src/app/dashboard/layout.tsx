'use client';

import * as React from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	// Redirect unauthenticated users to home page
	React.useEffect(() => {
		if (!isPending && !session?.user) {
			router.replace('/');
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	if (!session?.user) {
		// Show loading while redirecting
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	// User is authenticated, render the dashboard content
	return <>{children}</>;
}