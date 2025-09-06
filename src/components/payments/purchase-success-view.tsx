'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Crown, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

interface PurchaseData {
  status: string
  amount: number
  currency: string
  customerEmail: string
  createdAt: string
  purchase: {
    id: string
    status: string
    purchasedAt: string
  } | null
}

export function PurchaseSuccessView() {
  const searchParams = useSearchParams()
  const checkoutId = searchParams.get('checkout_id')
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPurchase = async () => {
      if (!checkoutId) {
        setError('No checkout ID provided')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/payments/verify?checkout_id=${checkoutId}`)
        const result = await response.json()

        if (result.success) {
          setPurchaseData(result.data)
        } else {
          setError(result.error || 'Failed to verify purchase')
        }
      } catch (err) {
        setError('Failed to verify purchase')
      } finally {
        setLoading(false)
      }
    }

    verifyPurchase()
  }, [checkoutId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying your purchase...</p>
        </div>
      </div>
    )
  }

  if (error || !purchaseData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-24">
        <div className="max-w-md w-full px-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-red-500 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❌</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error || 'Unable to verify your purchase. Please contact support.'}
              </p>
              <Button asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isSuccessful = purchaseData.status === 'confirmed' && purchaseData.purchase?.status === 'COMPLETED'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="mb-4">
              {isSuccessful ? (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl">⏳</span>
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              {isSuccessful ? 'Purchase Successful!' : 'Processing Payment...'}
            </CardTitle>
            <div className="text-gray-600 dark:text-gray-400">
              {isSuccessful 
                ? 'You now have premium access to all AI agents!'
                : 'Your payment is being processed. Please wait a moment.'
              }
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Purchase details */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Purchase Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span>Premium Access</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>
                    ${(purchaseData.amount / 100).toFixed(2)} {purchaseData.currency?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{purchaseData.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>
                    {new Date(purchaseData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${
                    isSuccessful ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {isSuccessful ? 'Completed' : 'Processing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium benefits */}
            {isSuccessful && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Premium Benefits Unlocked
                  </h3>
                </div>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 text-left">
                  <li>✅ Access to all premium AI agents</li>
                  <li>✅ Advanced prompts and configurations</li>
                  <li>✅ Exclusive agent updates and features</li>
                  <li>✅ Priority customer support</li>
                  <li>✅ Lifetime access - no subscription needed</li>
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/stacks">
                  <Crown className="h-4 w-4 mr-2" />
                  Browse Premium Agents
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>

            {/* Support info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-4">
              <p>
                Questions about your purchase? Contact us at support@getagentprompts.com
              </p>
              <p className="mt-1">
                Checkout ID: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">
                  {checkoutId}
                </code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}