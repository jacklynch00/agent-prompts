import { useQuery } from '@tanstack/react-query'
import { Purchase } from '@prisma/client'

interface UserPurchasesData {
  hasFullAccess: boolean
  purchases: Purchase[]
}

export function useUserPurchases() {
  return useQuery({
    queryKey: ['user-purchases'],
    queryFn: async (): Promise<UserPurchasesData> => {
      const response = await fetch('/api/user/purchases')
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user purchases')
      }
      
      return result.data
    },
  })
}