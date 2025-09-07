import { useQuery } from '@tanstack/react-query'
import { Agent } from '@/types/agent'

interface AgentsResponse {
  success: boolean
  data: Agent[]
  count: number
}

// Get all agents with optional filters
export function useAgents({
  platform,
  premium,
  category
}: {
  platform?: string
  premium?: boolean
  category?: string
} = {}) {
  const queryKey = ['agents', { platform, premium, category }]
  
  return useQuery<AgentsResponse>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (platform) params.append('platform', platform)
      if (premium !== undefined) params.append('premium', premium.toString())
      if (category) params.append('category', category)

      const response = await fetch(`/api/agents?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }
      
      return response.json()
    }
  })
}

// Get free agents only
export function useFreeAgents() {
  return useAgents({ premium: false })
}

// Get premium agents only
export function usePremiumAgents() {
  return useAgents({ premium: true })
}

// Get agents by platform
export function useAgentsByPlatform(platform: string) {
  return useAgents({ platform })
}

// Get agents by category
export function useAgentsByCategory(category: string) {
  return useAgents({ category })
}

// Get all agents (no filters)
export function useAllAgents() {
  return useAgents()
}