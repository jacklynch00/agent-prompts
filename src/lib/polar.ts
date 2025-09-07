import { Polar } from '@polar-sh/sdk'

// Initialize Polar SDK
export const api = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
})

export interface CheckoutSessionOptions {
  productId: string
  customerEmail?: string
  successUrl: string
  embedOrigin?: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession(options: CheckoutSessionOptions) {
  try {
    // Clean metadata - remove empty strings
    const cleanMetadata: Record<string, string> = {}
    if (options.metadata) {
      Object.entries(options.metadata).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          cleanMetadata[key] = value
        }
      })
    }

    const checkoutData = {
      products: [options.productId],
      customerEmail: options.customerEmail,
      successUrl: options.successUrl,
      metadata: Object.keys(cleanMetadata).length > 0 ? cleanMetadata : undefined,
      ...(options.embedOrigin && { embedOrigin: options.embedOrigin })
    }

    const response = await api.checkouts.create(checkoutData)

    return {
      success: true,
      data: response
    }
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    return {
      success: false,
      error: (error as Error).message || 'Failed to create checkout session'
    }
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const response = await api.checkouts.get({
      id: sessionId
    })

    return {
      success: true,
      data: response
    }
  } catch (error) {
    console.error('Failed to get checkout session:', error)
    return {
      success: false,
      error: (error as Error).message || 'Failed to get checkout session'
    }
  }
}

