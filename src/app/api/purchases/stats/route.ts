import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 1 minute

interface PurchaseStatsResponse {
	success: boolean;
	data: {
		totalPurchases: number;
		currentTier: number;
		currentPrice: number;
		nextMilestone: number | null;
		remainingInTier: number | null;
	};
}

function getPricingTier(count: number) {
	if (count < 100) {
		return {
			tier: 1,
			price: 19,
			nextMilestone: 100,
			remaining: 100 - count,
		};
	} else if (count < 1000) {
		return {
			tier: 2,
			price: 29,
			nextMilestone: 1000,
			remaining: 1000 - count,
		};
	} else {
		return {
			tier: 3,
			price: 39,
			nextMilestone: null,
			remaining: null,
		};
	}
}

export async function GET(): Promise<NextResponse<PurchaseStatsResponse>> {
	try {
		// Count total completed FULL_ACCESS purchases
		const totalPurchases = await db.purchase.count({
			where: {
				status: 'COMPLETED',
				productType: 'FULL_ACCESS',
			},
		});

		const tierInfo = getPricingTier(totalPurchases);

		return NextResponse.json({
			success: true,
			data: {
				totalPurchases,
				currentTier: tierInfo.tier,
				currentPrice: tierInfo.price,
				nextMilestone: tierInfo.nextMilestone,
				remainingInTier: tierInfo.remaining,
			},
		});
	} catch (error) {
		console.error('Failed to fetch purchase stats:', error);

		return NextResponse.json(
			{
				success: false,
				data: {
					totalPurchases: 0,
					currentTier: 1,
					currentPrice: 19,
					nextMilestone: 100,
					remainingInTier: 100,
				},
			},
			{ status: 500 }
		);
	}
}
