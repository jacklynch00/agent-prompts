import { useQuery } from '@tanstack/react-query'

interface PurchaseStats {
  totalPurchases: number
  currentTier: number
  currentPrice: number
  nextMilestone: number | null
  remainingInTier: number | null
}

interface PurchaseStatsResponse {
  success: boolean
  data: PurchaseStats
}

export function usePurchaseStats() {
  return useQuery<PurchaseStatsResponse>({
    queryKey: ['purchase-stats'],
    queryFn: async () => {
      const response = await fetch('/api/purchases/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch purchase stats')
      }
      
      return response.json()
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: 3
  })
}

export function usePricingTier() {
  const { data: statsResponse, ...query } = usePurchaseStats()
  
  const stats = statsResponse?.data
  
  return {
    ...query,
    totalPurchases: stats?.totalPurchases ?? 0,
    currentTier: stats?.currentTier ?? 1,
    currentPrice: stats?.currentPrice ?? 19,
    nextMilestone: stats?.nextMilestone,
    remainingInTier: stats?.remainingInTier,
    isLoading: query.isLoading,
    error: query.error
  }
}