import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/polar'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get session from Better-auth (required for authenticated checkout)
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productType, embed = false } = body

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

    // Prepare metadata for authenticated user
    const metadata: Record<string, string> = {
      productType: 'full_access',
      userId: session.user.id,
      userEmail: session.user.email || ''
    }

    const result = await createCheckoutSession({
      productId,
      customerEmail: session.user.email, // Use authenticated user's email
      successUrl,
      embedOrigin: embed ? baseUrl : undefined, // For embedded checkout
      metadata
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
        checkoutUrl: result.data?.url,
        sessionId: result.data?.id
      }
    })
  } catch (error) {
    console.error('Failed to create checkout:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}