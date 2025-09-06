import { PolarApi, Configuration } from '@polar-sh/sdk'

// Initialize Polar SDK
export const polar = new PolarApi(
  new Configuration({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    basePath: process.env.POLAR_BASE_URL || 'https://api.polar.sh'
  })
)

export interface CheckoutSessionOptions {
  productId: string
  customerEmail?: string
  successUrl: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession(options: CheckoutSessionOptions) {
  try {
    const response = await polar.checkoutsCreate({
      checkoutCreate: {
        product_id: options.productId,
        customer_email: options.customerEmail,
        success_url: options.successUrl,
        metadata: options.metadata
      }
    })

    return {
      success: true,
      data: response.data
    }
  } catch (error: any) {
    console.error('Failed to create checkout session:', error)
    return {
      success: false,
      error: error.message || 'Failed to create checkout session'
    }
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const response = await polar.checkoutsGet({
      id: sessionId
    })

    return {
      success: true,
      data: response.data
    }
  } catch (error: any) {
    console.error('Failed to get checkout session:', error)
    return {
      success: false,
      error: error.message || 'Failed to get checkout session'
    }
  }
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Failed to verify webhook signature:', error)
    return false
  }
}