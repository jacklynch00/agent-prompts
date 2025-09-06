import { SearchView } from '@/components/search/search-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search - Agent Prompts',
  description: 'Search for tech stacks and AI development agents.',
  robots: 'noindex, nofollow' // Search pages typically shouldn't be indexed
}

export default function SearchPage() {
  return <SearchView />
}