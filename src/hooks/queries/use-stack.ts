import { useQuery } from '@tanstack/react-query'

// Using the same stack data structure
interface Stack {
  id: string
  name: string
  description: string
  category: string
  technologies: string[]
  agents: Agent[]
  featured?: boolean
}

interface Agent {
  id: string
  name: string
  description: string
  platforms: Platform[]
  role?: string
  instructions?: string
}

interface Platform {
  type: string
  format?: string
  content?: string
  setupInstructions?: string[]
}

export function useStack(stackId: string) {
  return useQuery({
    queryKey: ['stack', stackId],
    queryFn: async (): Promise<Stack> => {
      const response = await fetch(`/api/stacks/${stackId}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Stack not found')
      }
      
      return result.data
    },
    enabled: !!stackId,
  })
}