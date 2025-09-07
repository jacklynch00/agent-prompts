import { useQuery } from '@tanstack/react-query'
import type { Stack } from '@/types/stack'

export function useStacks() {
  return useQuery({
    queryKey: ['stacks'],
    queryFn: async (): Promise<Stack[]> => {
      const response = await fetch('/api/stacks')
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch stacks')
      }
      
      return result.data
    },
  })
}