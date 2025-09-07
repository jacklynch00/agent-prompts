import { useMutation } from '@tanstack/react-query'

interface CreateCheckoutRequest {
  productType: string
  embed?: boolean
}

interface CreateCheckoutResponse {
  checkoutUrl: string
  sessionId: string
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (data: CreateCheckoutRequest): Promise<CreateCheckoutResponse> => {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout')
      }
      
      return result.data
    },
  })
}