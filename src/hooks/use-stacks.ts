import { useQuery } from '@tanstack/react-query'
import { Stack } from '@/lib/stack-types'

interface StacksResponse {
  success: boolean
  data: Stack[]
  count: number
}

interface StackResponse {
  success: boolean
  data: Stack
}

// Get all stacks with optional filters
export function useStacks({
  category,
  difficulty,
  search,
  popular,
  recent,
  limit
}: {
  category?: string
  difficulty?: string
  search?: string
  popular?: boolean
  recent?: boolean
  limit?: number
} = {}) {
  const queryKey = ['stacks', { category, difficulty, search, popular, recent, limit }]
  
  return useQuery<StacksResponse>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (category) params.append('category', category)
      if (difficulty) params.append('difficulty', difficulty)
      if (search) params.append('search', search)
      if (popular) params.append('popular', 'true')
      if (recent) params.append('recent', 'true')
      if (limit) params.append('limit', limit.toString())

      const response = await fetch(`/api/stacks?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch stacks')
      }
      
      return response.json()
    }
  })
}

// Get a single stack by ID
export function useStack(id: string, options?: { userId?: string; sessionId?: string }) {
  return useQuery<StackResponse>({
    queryKey: ['stack', id],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (options?.userId) params.append('userId', options.userId)
      if (options?.sessionId) params.append('sessionId', options.sessionId)

      const url = `/api/stacks/${id}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Stack not found')
        }
        throw new Error('Failed to fetch stack')
      }
      
      return response.json()
    },
    enabled: !!id
  })
}

// Get popular stacks
export function usePopularStacks(limit = 10) {
  return useQuery({
    queryKey: ['stacks', { popular: true, limit }],
    queryFn: async (): Promise<Stack[]> => {
      const response = await fetch(`/api/stacks?popular=true&limit=${limit}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch popular stacks')
      }
      
      return result.data
    },
  })
}

// Get recent stacks  
export function useRecentStacks(limit = 5) {
  return useQuery({
    queryKey: ['stacks', { recent: true, limit }],
    queryFn: async (): Promise<Stack[]> => {
      const response = await fetch(`/api/stacks?recent=true&limit=${limit}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch recent stacks')
      }
      
      return result.data
    },
  })
}

// Search stacks
export function useSearchStacks(query: string) {
  return useQuery({
    queryKey: ['stacks', { search: query }],
    queryFn: async (): Promise<Stack[]> => {
      const response = await fetch(`/api/stacks?search=${encodeURIComponent(query)}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch stacks')
      }
      
      return result.data
    },
    enabled: !!query && query.length > 2 // Only search if query is longer than 2 characters
  })
}