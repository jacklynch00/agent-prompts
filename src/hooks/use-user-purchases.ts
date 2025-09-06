import { useQuery } from '@tanstack/react-query'
import { useSession } from '@/lib/auth-client'

interface UserPurchase {
  id: string
  productType: 'FULL_ACCESS' | 'INDIVIDUAL_STACK'
  productId?: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  purchasedAt: string
  createdAt: string
  updatedAt: string
}

interface UserPurchasesResponse {
  success: boolean
  data: UserPurchase[]
}

export function useUserPurchases() {
  const { data: session } = useSession()

  return useQuery<UserPurchasesResponse>({
    queryKey: ['user-purchases', session?.user?.id],
    queryFn: async () => {
      const response = await fetch('/api/user/purchases')
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized')
        }
        throw new Error('Failed to fetch purchases')
      }
      
      return response.json()
    },
    enabled: !!session?.user
  })
}

export function useHasPremiumAccess() {
  const { data: purchasesResponse, ...query } = useUserPurchases()
  
  const hasPremiumAccess = purchasesResponse?.data?.some(
    purchase => purchase.productType === 'FULL_ACCESS' && purchase.status === 'COMPLETED'
  ) || false

  return {
    hasPremiumAccess,
    ...query
  }
}