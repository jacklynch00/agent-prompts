import { Suspense } from 'react'
import { PurchaseSuccessView } from '@/components/payments/purchase-success-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Purchase Successful - Agent Prompts',
  description: 'Your premium access purchase was successful.',
  robots: 'noindex, nofollow'
}

function SuccessFallback() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8 mx-auto"></div>
          <div className="bg-gray-200 rounded-lg h-64 mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <PurchaseSuccessView />
    </Suspense>
  )
}