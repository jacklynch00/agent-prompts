import { NextResponse } from 'next/server'
import { StackService } from '@/data'
import { AnalyticsService } from '@/lib/analytics'

interface Params {
  id: string
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const stack = StackService.getStackById(id)

    if (!stack) {
      return NextResponse.json(
        { success: false, error: 'Stack not found' },
        { status: 404 }
      )
    }

    // Track stack view (can be enhanced with user tracking later)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    
    // Fire and forget analytics tracking
    AnalyticsService.trackStackView(id, userId || undefined, sessionId || undefined)
      .catch(error => console.error('Failed to track stack view:', error))

    return NextResponse.json({
      success: true,
      data: stack
    })
  } catch (error) {
    console.error('Error fetching stack:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stack' },
      { status: 500 }
    )
  }
}