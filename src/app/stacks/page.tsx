import { StacksListingView } from '@/components/stacks/stacks-listing-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech Stacks - Agent Prompts',
  description: 'Browse all available tech stacks and their specialized AI development agents.',
  keywords: 'tech stacks, AI agents, development tools, programming assistants',
  openGraph: {
    title: 'Tech Stacks - Agent Prompts',
    description: 'Browse all available tech stacks and their specialized AI development agents.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Stacks - Agent Prompts',
    description: 'Browse all available tech stacks and their specialized AI development agents.'
  }
}

export default function StacksPage() {
  return <StacksListingView />
}