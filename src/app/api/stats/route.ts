import { NextResponse } from 'next/server'
import { StackService } from '@/data'

export async function GET() {
  try {
    const stats = StackService.getStackStats()

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}