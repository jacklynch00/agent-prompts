import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
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
    const { checkoutId, userId } = body

    if (!checkoutId) {
      return NextResponse.json(
        { success: false, error: 'Checkout ID is required' },
        { status: 400 }
      )
    }

    // Verify the authenticated user matches the userId being linked
    if (userId && userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot link purchase to different user' },
        { status: 403 }
      )
    }

    // Check if purchase exists and verify ownership
    const existingPurchase = await db.purchase.findFirst({
      where: { paymentId: checkoutId }
    })

    if (!existingPurchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      )
    }

    if (existingPurchase.userId === session.user.id) {
      // Already linked to this user
      return NextResponse.json({
        success: true,
        message: 'Purchase already linked to your account'
      })
    } else {
      // Purchase belongs to different user - this shouldn't happen with proper auth flow
      return NextResponse.json(
        { success: false, error: 'Purchase is already linked to another account' },
        { status: 409 }
      )
    }

    // This code path shouldn't be reached with the current logic
  } catch (error) {
    console.error('Failed to link purchase:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}