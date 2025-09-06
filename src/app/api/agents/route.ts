import { NextResponse } from 'next/server'
import { StackService } from '@/data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const premium = searchParams.get('premium')
    const category = searchParams.get('category')

    let agents

    if (platform) {
      agents = StackService.getAgentsByPlatform(platform)
    } else if (premium === 'true') {
      agents = StackService.getPremiumAgents()
    } else if (premium === 'false') {
      agents = StackService.getFreeAgents()
    } else {
      agents = StackService.getAllAgents()
    }

    // Filter by category if specified
    if (category) {
      agents = agents.filter(agent => agent.category === category)
    }

    return NextResponse.json({
      success: true,
      data: agents,
      count: agents.length
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}