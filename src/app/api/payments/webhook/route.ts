import { Webhooks } from '@polar-sh/nextjs';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

// Add error handling wrapper
export async function POST(request: Request) {
	try {
		// Log headers for debugging
		const headers = Object.fromEntries(request.headers.entries());
		console.log('Webhook endpoint hit:', {
			url: request.url,
			method: request.method,
			hasSecret: !!process.env.POLAR_WEBHOOK_SECRET,
			secretLength: process.env.POLAR_WEBHOOK_SECRET?.length || 0,
			allHeaders: headers, // Log ALL headers to see what's actually sent
			polarSignature: headers['polar-signature'] || 'missing',
			contentType: headers['content-type'],
		});

		const result = await webhookHandler(request as NextRequest);
		
		console.log('Webhook handler result:', {
			status: result.status,
			statusText: result.statusText,
		});
		
		return result;
	} catch (error) {
		console.error('Webhook error details:', {
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});
		return new Response('Webhook error', { status: 500 });
	}
}

const webhookHandler = Webhooks({
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
	onPayload: async (payload) => {
		console.log('Webhook received successfully:', {
			type: payload.type,
			timestamp: new Date().toISOString(),
		});
		switch (payload.type) {
			case 'order.paid': {
				const { data } = payload;
				const { metadata } = data;

				// Get userId from metadata (should always be present for authenticated checkout)
				const userId = metadata?.userId;

				if (!userId) {
					console.error('No userId in checkout metadata:', data.id);
					break;
				}

				try {
					// Check if purchase already exists for this paymentId
					const existingPurchase = await db.purchase.findUnique({
						where: { paymentId: data.id },
					});

					if (existingPurchase) {
						console.warn(`Purchase already exists for paymentId ${data.id}. This webhook may be a duplicate.`, {
							existingPurchase: {
								id: existingPurchase.id,
								userId: existingPurchase.userId,
								status: existingPurchase.status,
								createdAt: existingPurchase.createdAt,
							},
							webhookData: {
								orderId: data.id,
								userId: userId,
								amount: data.totalAmount,
							},
						});
						return; // Skip creation, this is likely a duplicate webhook
					}

					// Create initial purchase record
					await db.purchase.create({
						data: {
							userId: userId as string,
							productType: metadata?.productType === 'full_access' ? 'FULL_ACCESS' : 'INDIVIDUAL_STACK',
							productId: metadata?.productId as string | null,
							amount: Number(data.totalAmount) / 100, // Convert from cents to dollars
							currency: data.currency,
							paymentProvider: 'polar',
							paymentId: data.id,
							status: 'COMPLETED', // order.paid means it's already completed
							purchasedAt: new Date(data.createdAt),
						},
					});

					console.log(`Purchase created for user ${userId}`, {
						paymentId: data.id,
						amount: data.totalAmount,
						currency: data.currency,
					});
				} catch (error) {
					console.error('Failed to create purchase record:', error);
				}
				break;
			}

			default:
				console.log(`Unhandled webhook event: ${payload.type}`);
		}
	},
});
