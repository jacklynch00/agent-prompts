import { NextRequest, NextResponse } from 'next/server'
import { getCheckoutSession } from '@/lib/polar'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get session from Better-auth
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const checkoutId = searchParams.get('checkout_id')

    if (!checkoutId) {
      return NextResponse.json(
        { success: false, error: 'Missing checkout_id' },
        { status: 400 }
      )
    }

    // Get checkout session from Polar
    const result = await getCheckoutSession(checkoutId)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    const checkout = result.data

    // Check if purchase exists in our database
    const purchase = await db.purchase.findUnique({
      where: {
        paymentId: checkoutId
      }
    })

    if (!purchase) {
      // Create purchase record if it doesn't exist and checkout is completed
      if (checkout.status === 'confirmed') {
        await db.purchase.create({
          data: {
            userId: session.user.id,
            productType: 'FULL_ACCESS',
            amount: parseFloat(checkout.amount) / 100,
            currency: checkout.currency || 'USD',
            paymentProvider: 'polar',
            paymentId: checkoutId,
            status: 'COMPLETED',
            purchasedAt: new Date()
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        status: checkout.status,
        amount: checkout.amount,
        currency: checkout.currency,
        customerEmail: checkout.customer_email,
        createdAt: checkout.created_at,
        purchase: purchase ? {
          id: purchase.id,
          status: purchase.status,
          purchasedAt: purchase.purchasedAt
        } : null
      }
    })
  } catch (error: any) {
    console.error('Failed to verify purchase:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}