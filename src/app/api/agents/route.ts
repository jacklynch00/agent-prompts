import { NextResponse } from 'next/server'
import { AgentService } from '@/data/agents'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const premium = searchParams.get('premium')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let agents

    if (platform) {
      agents = AgentService.getAgentsByPlatform(platform)
    } else if (premium === 'true') {
      agents = AgentService.getPremiumAgents()
    } else if (premium === 'false') {
      agents = AgentService.getFreeAgents()
    } else {
      agents = AgentService.getAllAgents()
    }

    // Filter by category if specified
    if (category) {
      agents = agents.filter(agent => agent.category === category)
    }

    // Filter by search query if specified
    if (search) {
      agents = AgentService.searchAgents(search)
      // Apply other filters to search results if needed
      if (category) {
        agents = agents.filter(agent => agent.category === category)
      }
      if (platform) {
        agents = agents.filter(agent => 
          agent.platforms.some(p => p.type === platform)
        )
      }
      if (premium === 'true') {
        agents = agents.filter(agent => agent.isPremium)
      } else if (premium === 'false') {
        agents = agents.filter(agent => !agent.isPremium)
      }
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