import { PurchaseSuccessView } from '@/components/payments/purchase-success-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Purchase Successful - Agent Prompts',
  description: 'Your premium access purchase was successful.',
  robots: 'noindex, nofollow'
}

export default function SuccessPage() {
  return <PurchaseSuccessView />
}