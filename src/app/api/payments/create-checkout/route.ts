import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/polar'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get session from Better-auth
    const session = await auth.api.getSession({
      headers: request.headers
    })

    const body = await request.json()
    const { productType } = body

    // For now, we only support full access purchase
    if (productType !== 'full_access') {
      return NextResponse.json(
        { success: false, error: 'Invalid product type' },
        { status: 400 }
      )
    }

    const productId = process.env.POLAR_PRODUCT_ID!
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    const baseUrl = request.headers.get('origin') || 'http://localhost:3000'
    const successUrl = `${baseUrl}/success?checkout_id={CHECKOUT_ID}`

    const result = await createCheckoutSession({
      productId,
      customerEmail: session?.user?.email,
      successUrl,
      metadata: {
        userId: session?.user?.id || '',
        productType: 'full_access'
      }
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        checkoutUrl: result.data.url,
        sessionId: result.data.id
      }
    })
  } catch (error: any) {
    console.error('Failed to create checkout:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}