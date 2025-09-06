import { NextResponse } from 'next/server'
import { StackService } from '@/data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const popular = searchParams.get('popular') === 'true'
    const recent = searchParams.get('recent') === 'true'
    const limit = searchParams.get('limit')

    let stacks

    if (search) {
      stacks = StackService.searchStacks(search)
    } else if (category) {
      stacks = StackService.getStacksByCategory(category)
    } else if (difficulty) {
      stacks = StackService.getStacksByDifficulty(difficulty)
    } else if (popular) {
      stacks = StackService.getPopularStacks(limit ? parseInt(limit) : undefined)
    } else if (recent) {
      stacks = StackService.getRecentStacks(limit ? parseInt(limit) : undefined)
    } else {
      stacks = StackService.getAllStacks()
    }

    return NextResponse.json({
      success: true,
      data: stacks,
      count: stacks.length
    })
  } catch (error) {
    console.error('Error fetching stacks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stacks' },
      { status: 500 }
    )
  }
}