import { NextRequest, NextResponse } from 'next/server'
import { getCheckoutSession } from '@/lib/polar'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get session from Better-auth (optional for guest verification)
    const session = await auth.api.getSession({
      headers: request.headers
    })

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
    const purchase = await db.purchase.findFirst({
      where: {
        paymentId: checkoutId
      }
    })

    // Check if this is a guest checkout by looking for user with the checkout email
    let userAccount = null
    if (checkout?.customerEmail) {
      userAccount = await db.user.findUnique({
        where: { email: checkout.customerEmail }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        status: checkout?.status,
        amount: checkout?.amount,
        currency: checkout?.currency,
        customerEmail: checkout?.customerEmail,
        createdAt: checkout?.createdAt,
        purchase: purchase ? {
          id: purchase.id,
          status: purchase.status,
          purchasedAt: purchase.purchasedAt
        } : null,
        hasAccount: !!userAccount,
        isLoggedIn: !!session?.user,
        checkoutId
      }
    })
  } catch (error) {
    console.error('Failed to verify purchase:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}