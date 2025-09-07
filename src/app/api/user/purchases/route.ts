import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
	try {
		// Get session from Better-auth
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		// Get user's purchases
		const purchases = await db.purchase.findMany({
			where: {
				userId: session.user.id,
				status: 'COMPLETED',
			},
			orderBy: {
				purchasedAt: 'desc',
			},
		});

		// Check if user has full access
		const hasFullAccess = purchases.some((purchase) => purchase.productType === 'FULL_ACCESS');

		return NextResponse.json({
			success: true,
			data: {
				hasFullAccess,
				purchases: purchases.map((purchase) => ({
					id: purchase.id,
					productType: purchase.productType,
					amount: purchase.amount,
					currency: purchase.currency,
					purchasedAt: purchase.purchasedAt,
					status: purchase.status,
				})),
			},
		});
	} catch (error: unknown) {
		console.error('Failed to fetch user purchases:', error);
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
