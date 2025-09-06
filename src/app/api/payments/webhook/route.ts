import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/polar'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('polar-webhook-signature')
    const payload = await request.text()

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Webhook secret not configured')
      return NextResponse.json(
        { success: false, error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(payload, signature, webhookSecret)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(payload)
    console.log('Received Polar webhook:', event.type)

    // Handle different webhook events
    switch (event.type) {
      case 'checkout.completed': {
        const checkout = event.data
        const { customer_email, metadata } = checkout

        if (metadata?.userId) {
          // Create or update purchase record
          await db.purchase.upsert({
            where: {
              paymentId: checkout.id
            },
            create: {
              userId: metadata.userId,
              productType: metadata.productType === 'full_access' ? 'FULL_ACCESS' : 'INDIVIDUAL_STACK',
              productId: metadata.productId || null,
              amount: parseFloat(checkout.amount) / 100, // Convert from cents
              currency: checkout.currency || 'USD',
              paymentProvider: 'polar',
              paymentId: checkout.id,
              status: 'COMPLETED',
              purchasedAt: new Date(checkout.created_at)
            },
            update: {
              status: 'COMPLETED',
              purchasedAt: new Date(checkout.created_at)
            }
          })

          console.log(`Purchase completed for user ${metadata.userId}`)
        }
        break
      }

      case 'checkout.failed': {
        const checkout = event.data
        const { metadata } = checkout

        if (metadata?.userId) {
          // Update purchase record as failed
          await db.purchase.updateMany({
            where: {
              paymentId: checkout.id
            },
            data: {
              status: 'FAILED'
            }
          })

          console.log(`Purchase failed for user ${metadata.userId}`)
        }
        break
      }

      default:
        console.log(`Unhandled webhook event: ${event.type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}